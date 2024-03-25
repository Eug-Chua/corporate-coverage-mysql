-- INSERT Statements for Corporate Banking Coverage Team
use cbct;
-- Inserting data into Borrowers
INSERT INTO Borrowers (name, obligor_risk_rating, description) VALUES
('Archer-Daniels-Midland Company', "5+", "Global leader in human nutrition and the world's premier agricultural origination and processing company."),
('Bunge Global', '5-','The world’s leader in oilseed processing and a leading producer and supplier of specialty plant-based oils, fats and protein.'),
('Cargill', '4', "The world’s largest agribusiness with assets across agriculture and industry, including steel and transport."),
("Louis Dreyfus Company", '4-', "Global leader in agricultural processing with business lines spanning entire value chains.");

-- Inserting data into Clients
INSERT INTO Clients (first_name, last_name, borrower_id) VALUES
('Juan', 'Luciano', 1),
('Greg', 'Heckman', 2),
('Brian', 'Sikes', 3),
('Michael', 'Gelchie', 4);

-- Inserting data into Departments
INSERT INTO Departments (name) VALUES
('Client Coverage'),
('Transaction Banking'),
('Capital Markets');

-- Inserting data into Employees
INSERT INTO Employees (first_name, last_name, department_id) VALUES
('Jared', 'Vennett', 1),
('Wing', 'Chau', 1),
('Ted', 'Jiang', 2);

-- Inserting data into Products
INSERT INTO Products (name, description) VALUES
('Term Loan', 'Structured product to finance specific transactions.'),
('Bridge Financing', 'Intermediate funding product to finance working capital requirements.'),
('Letter of Credit', "Issuances of guarantees on companies' behalf to make future payments.");

-- Inserting data into Sales
INSERT INTO Sales (product_id, employee_id, borrower_id, amount, sale_date) VALUES
(1, 1, 1, 10.5, '2024-01-05'),
(2, 1, 2, 25.5, '2024-02-20'),
(3, 2, 3, 15.0, '2024-01-25');

-- Inserting data into EmployeeBorrower
INSERT INTO EmployeeBorrower (employee_id, borrower_id) VALUES
(1, 1),
(2, 2),
(1, 3);

-- Inserting data into EmployeeProduct
INSERT INTO EmployeeProduct (employee_id, product_id) VALUES
(1, 1),
(1, 2),
(2, 3);