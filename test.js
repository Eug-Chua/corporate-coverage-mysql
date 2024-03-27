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
    // app.get('/borrowers', async function(req,res){
    //     let [borrowers] = await connection.execute(`
    //     SELECT * FROM Borrowers
    //     `);
    //     // the code above is the same as: let customers = await connection.execute("SELECT * FROM Borrowers")[0];
    //     res.render('borrowers', {
    //         borrowers
    //     })
    // })

    app.get('/borrowers', async function(req, res){
        let [borrowers] = await connection.execute(`
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
        `);
    
        res.render('borrowers', {
            borrowers
        });
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

    // app.get("/update-borrowers/:borrowerID", async function(req,res){
    //     const {borrowerID} = req.params;
    //     const query = `SELECT * FROM Borrowers WHERE borrower_id = ?`;
    //     const [borrowers] = await connection.execute(query, [borrowerID]);
    //     const wantedBorrower = borrowers[0];

    //     res.render('update-borrowers',{
    //         'borrower':wantedBorrower
    //     })
    // })

    app.get("/update-borrowers/:borrowerID", async function(req, res) {
        const { borrowerID } = req.params;

        const [borrowers] = await connection.execute("SELECT * FROM Borrowers WHERE borrower_id = ?", [borrowerID]);
        const borrower = borrowers[0]; // Assuming you're fetching one borrower
    
        // Existing logic to fetch borrower and products...
        const [products] = await connection.execute("SELECT * FROM Products");
    
        // Attempt to fetch sales for this borrower
        let [sales] = await connection.execute(`
            SELECT s.sale_id, s.amount, s.product_id AS selected_product_id
            FROM Sales s
            WHERE s.borrower_id = ?`, 
            [borrowerID]);
    
        // Check if the borrower has no sales; if not, add a placeholder for new data
        if (sales.length === 0) {
            sales = [{
                sale_id: null,
                amount: null,
                selected_product_id: null,
                products: products.map(product => ({
                    ...product,
                    isSelected: false // No product is selected
                }))
            }];
        } else {
            for (let sale of sales) {
                sale.products = products.map(product => ({
                    ...product,
                    isSelected: product.product_id === sale.selected_product_id
                }));
            }
        }
    
        res.render('update-borrowers', {
            borrower, 
            products,
            borrowerID, // Make sure to pass this for the form action
            sales // Modified to always include at least one entry
        });
    });
    

    // app.post("/update-borrowers/:borrowerID", async function(req, res){
    //     const { borrowerID } = req.params;
    //     const { borrower_name, risk_rating, description } = req.body;
    //     const query = `UPDATE Borrowers SET name = ?, obligor_risk_rating = ?, description = ? WHERE borrower_id = ?`;
    //     await connection.execute(query, [borrower_name, risk_rating, description, borrowerID]);
    //     res.redirect('/borrowers');
    // });

    // Simplified example; adjust according to your needs

    app.post("/update-borrowers/:borrowerID", async function(req, res){
        const { borrowerID } = req.params;
        let sales = req.body.sales;
        
        // Ensure sales is always an array
        sales = Array.isArray(sales) ? sales : [sales];
    
        try {
            for (let sale of sales) {
                const { sale_id, product_id, loan_amount } = sale;
                const amount = parseFloat(loan_amount); // Ensure amount is a number
    
                if (sale_id) {
                    await connection.execute("UPDATE Sales SET product_id = ?, amount = ? WHERE sale_id = ?", [product_id, amount, sale_id]);
                } else {
                    if (product_id && !isNaN(amount)) {
                        await connection.execute("INSERT INTO Sales (borrower_id, product_id, amount) VALUES (?, ?, ?)", [borrowerID, product_id, amount]);
                    }
                }
            }
        } catch (error) {
            console.error("Failed to update sales:", error);
            return res.status(500).send("Server error occurred.");
        }
    
        res.redirect('/borrowers');
    });
    
    

    // app.post("/update-borrowers/:borrowerID", async function(req, res) {
    //     const { borrowerID } = req.params;
    //     const { sales } = req.body; // Assuming `sales` is structured as an array of objects
    
    //     for (let sale of sales) {
    //         const { sale_id, product_id, loan_amount } = sale;
    
    //         // Check if this is an existing sale or a new one
    //         if (sale_id) {
    //             // Update existing sale
    //             await connection.execute(`
    //                 UPDATE Sales 
    //                 SET product_id = ?, amount = ? 
    //                 WHERE sale_id = ?`, 
    //                 [product_id, loan_amount, sale_id]);
    //         } else if (product_id && loan_amount) {
    //             // Create new sale, assuming product_id and loan_amount must both be provided
    //             await connection.execute(`
    //                 INSERT INTO Sales (product_id, employee_id, borrower_id, amount, sale_date) 
    //                 VALUES (?, ?, ?, ?, CURDATE())`, 
    //                 [product_id, /* employee_id */, borrowerID, loan_amount]);
    //             // Note: You'll need to handle `employee_id` accordingly, perhaps as a hidden field in the form or set it based on the session/user context
    //         }
    //     }
    
    //     res.redirect('/borrowers');
    // });
    

    
}

main()

// START THE SERVER
app.listen(1010, function(){
    console.log('Server has started.')
})