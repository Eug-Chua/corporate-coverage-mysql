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
    app.get('/borrowers', async function(req,res){
        let [borrowers] = await connection.execute(`
        SELECT * FROM Borrowers
        `);
        // the code above is the same as: let customers = await connection.execute("SELECT * FROM Borrowers")[0];
        res.render('borrowers', {
            borrowers
        })
    })

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

    app.get("/update-borrowers/:borrowerID", async function(req,res){
        const {borrowerID} = req.params;
        const query = `SELECT * FROM Borrowers WHERE borrower_id = ?`;
        const [borrowers] = await connection.execute(query, [borrowerID]);
        const wantedBorrower = borrowers[0];

        res.render('update-borrowers',{
            'borrower':wantedBorrower
        })
    })

    app.post("/update-borrowers/:borrowerID", async function(req, res){
        const { borrowerID } = req.params;
        const { borrower_name, risk_rating, description } = req.body;
        const query = `UPDATE Borrowers SET name = ?, obligor_risk_rating = ?, description = ? WHERE borrower_id = ?`;
        await connection.execute(query, [borrower_name, risk_rating, description, borrowerID]);
        res.redirect('/borrowers');
    });
}

main()

// START THE SERVER
app.listen(1010, function(){
    console.log('Server has started.')
})