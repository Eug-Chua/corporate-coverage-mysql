const express = require("express");
const { createConnection } = require('mysql2/promise');

// set up the handlebars
const hbs = require("hbs");
const wax = require("wax-on");
require('dotenv').config();

const app = express();

// set up view engine
app.set('view engine', 'hbs');

require('handlebars-helpers')({
    handlebars: hbs.handlebars
});

// enable static files
app.use(express.static('public'));

// enable form processing
app.use(express.urlencoded({
    extended:false
}))

wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts')

async function main() {
    const connection = await createConnection({
        // we use host because it refers to the server that hosts the database (in the form of IP address or web domain name)
        'host': process.env.DB_HOST, 
        'user': process.env.DB_USER, 
        'database': process.env.DB_DATABASE,
        'password': process.env.DB_PASSWORD
    })

    // ROUTING
    app.get('/borrowers', async function(req, res){
        const {searchBorrower,product_id} = req.query;
        let searchquery = `WHERE `;
        let queryArray = [];
        if(searchBorrower)
            queryArray.push(`b.name = "${searchBorrower}"`);
        if(product_id)
            queryArray.push(`p.product_id = ${product_id}`);
        for (let index = 0; index < queryArray.length; index++) {
            searchquery = searchquery + queryArray[index];
            if(index != queryArray.length - 1)
                searchquery = searchquery + " AND "
        }

        let [borrowers] = !queryArray.length ? await connection.execute(`
            SELECT 
                b.borrower_id,
                b.name,
                b.obligor_risk_rating,
                p.name AS product_name,
                s.amount
            FROM
                Borrowers b
            LEFT JOIN Sales s ON b.borrower_id = s.borrower_id
            LEFT JOIN Products p ON s.product_id = p.product_id
        `) : await connection.execute(`
            SELECT 
                b.borrower_id,
                b.name,
                b.obligor_risk_rating,
                p.name AS product_name,
                s.amount
            FROM
                Borrowers b
            LEFT JOIN Sales s ON b.borrower_id = s.borrower_id
            LEFT JOIN Products p ON s.product_id = p.product_id
            ${searchquery} 
        `);

        const [products] = await connection.execute("SELECT * FROM Products");

        res.render('borrowers', {
            borrowers,
            products
        });
    });

    app.post("/borrowers", async function (req,res){
        const {borrower_id,product_id} = req.body;
        res.redirect(`/borrowers?searchBorrower=${borrower_id}&product_id=${product_id}`);
    });

    app.get('/create-borrowers', async function(req,res){
        const [borrowers] = await connection.execute("SELECT * FROM Borrowers");
        res.render('create-borrowers', {
            borrowers
        });
    })

    app.post('/create-borrowers', async function(req, res){
        const {borrower_name, risk_rating, description} = req.body;
        
        const query = `INSERT INTO Borrowers (name, obligor_risk_rating, description)
        VALUES ("${borrower_name}", "${risk_rating}", "${description}");`;

        const response = await connection.execute(query);

        res.redirect('/borrowers');
    })

    app.get("/delete-borrowers/:borrowerID", async function(req,res){
        const {borrowerID} = req.params;
        const query = `SELECT * FROM Borrowers WHERE borrower_id = ${borrowerID}`;

        const [borrowers] = await connection.execute(query);
        const borrowerToDelete = borrowers[0];

        res.render('delete-borrowers', {
            'borrower': borrowerToDelete
        })
    })

    app.post("/delete-borrowers/:borrowerID", async function(req, res){
        const {borrowerID} = req.params;

        // check if borrower ID is in a relationship with an employee
        const checkBorrowerQuery = `SELECT * FROM EmployeeBorrower WHERE borrower_id = ?`;
        const [involved] = await connection.execute(checkBorrowerQuery, [borrowerID]);        
        if (involved.length > 0) {
            res.send("Unable to delete: Borrower is still tagged to an employee.");
            return;
        }

        const query = `DELETE FROM Borrowers WHERE borrower_id = ${borrowerID}`;
        await connection.execute(query);
        res.redirect('/borrowers');
    })

    app.get("/update-borrowers/:borrowerID", async function(req, res) {
        const { borrowerID } = req.params;

        const [borrowers] = await connection.execute("SELECT * FROM Borrowers WHERE borrower_id = ?", [borrowerID]);
        const borrower = borrowers[0];

        const [products] = await connection.execute("SELECT * FROM Products");
    
        // Fetch sales for this borrower
        let [sales] = await connection.execute(`
            SELECT s.sale_id, s.amount, s.product_id AS selected_product_id
            FROM Sales s
            WHERE s.borrower_id = ?`, 
            [borrowerID]);
    
        if (sales.length === 0) {
            sales = {
                sale_id: null,
                amount: null,
                selected_product_id: null,
                products: products.map(product => ({
                    ...product,
                    isSelected: false // No product is selected
                }))
            };
        }
        else
            sales = sales[0];
        
        res.render('update-borrowers', {
            borrower, 
            products,
            borrowerID, 
            sales
        });
    });

    app.post("/update-borrowers/:borrowerID", async function(req, res){
        const { borrowerID } = req.params;
        let {sale_id, product_id,loan_amount} = req.body;
        // sales = Array.isArray(sales) ? sales : [sales];
    
        try {
            const amount = parseFloat(loan_amount);

            if (sale_id) {
                await connection.execute("UPDATE Sales SET product_id = ?, amount = ? WHERE sale_id = ?", [product_id, amount, sale_id]);
            } else {
                if (product_id && !isNaN(amount)) {
                    await connection.execute("INSERT INTO Sales (borrower_id, product_id, amount) VALUES (?, ?, ?)", [borrowerID, product_id, amount]);
                }
            }
            
        } catch (error) {
            console.error("Failed to update sales:", error);
            return res.status(500).send("Server error occurred.");
        }
    
        res.redirect('/borrowers');
    });
}

main()

// START THE SERVER
app.listen(1010, function(){
    console.log('Server has started.')
})