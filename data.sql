-- Sample INSERT Statements for Corporate Banking Coverage Team
use crm;
-- Inserting data into Companies
INSERT INTO Companies (name, obligor_risk_rating, description) VALUES
('Archer-Daniels-Midland Company', "5+", "Global leader in human nutrition and the world's premier agricultural origination and processing company"),
('Bunge Global', '5-','The world’s leader in oilseed processing and a leading producer and supplier of specialty plant-based oils, fats and protein'),
('Cargill', '4', "The world’s largest agribusiness with assets across agriculture and industry, including steel and transport.");
('Louis Dreyfus Company', '4-', "Global leader in agricultural processing with business lines spanning entire value chains.");

-- Inserting data into Clients
INSERT INTO Clients (first_name, last_name, rating, company_id) VALUES
('John', 'Doe', 5, 1),
('Jane', 'Smith', 4, 2),
('Alice', 'Johnson', 3, 3);

-- Inserting data into Departments
INSERT INTO Departments (name) VALUES
('Sales'),
('Marketing'),
('Finance');

-- Inserting data into Employees
INSERT INTO Employees (first_name, last_name, department_id) VALUES
('Robert', 'Brown', 1),
('Emily', 'Davis', 1),
('Michael', 'Wilson', 2);

-- Inserting data into Products
INSERT INTO Products (name, description) VALUES
('Investment Plan A', 'Comprehensive investment plan for long-term growth'),
('Retirement Fund B', 'Retirement fund with a focus on stability and steady income'),
('Equity Package C', 'Diverse equity package for aggressive growth');

-- Inserting data into Sales
INSERT INTO Sales (product_id, employee_id, client_id, quantity, sale_date) VALUES
(1, 1, 1, 10, '2024-01-15'),
(2, 1, 2, 5, '2024-01-20'),
(3, 2, 3, 15, '2024-01-25');

-- Inserting data into EmployeeCustomer
INSERT INTO EmployeeCustomer (employee_id, client_id) VALUES
(1, 1),
(2, 2),
(1, 3);

-- Inserting data into EmployeeProduct
INSERT INTO EmployeeProduct (employee_id, product_id) VALUES
(1, 1),
(1, 2),
(2, 3);