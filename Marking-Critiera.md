# MySQL Database Proficiency
The created database must meet the following criteria:
- There must be at least three tables in the database
    - `Borrowers`, `Clients`, `Employees`
- There must be at least one foreign key
    - `Clients`, `Sales`, `Employees`
- Every table must have a primary key which is an unsigned integer
- One table must have at least four columns
    - `Borrowers`
- Demonstrate the use of three different data types, besides int, across
the tables.
    - `Employees`: VARCHAR
    - `Sales`: FLOAT, DATE

In your project, you must be able to demonstrate, for one table:
- At least two SELECT statements. One of the statements must have to be able to filter the table by at least two criteria.
- Perform at least one INSERT INTO statement on the table
    - see `app.post('/create-borrowers', async function(req, res)`
- Perform at least one UPDATE statement on the table
    - see `app.post("/update-borrowers/:borrowerID", async function(req, res)`
- Perform at least one DELETE statement on the table
    - see `app.post("/delete-borrowers/:borrowerID", async function(req, res)`

# Express Proficiency
Your Express application must implement the following routes:
- Reading and displaying all data records
- Search for data records given search terms. There must be at least two filtering criteria.
- The user must be able to select which data record to modify or to delete
- Displaying a form to create a new data record
- Process the create form to add a new data record
- Display a form to modify an existing data
- Process the modify form to update an existing data record
- Display a confirmation before deleting a record
- Deleting an existing record    