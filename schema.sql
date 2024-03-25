-- SQL Schema for Corporate Banking Coverage Team
CREATE DATABASE cbct;

USE cbct;

-- Creating Borrowers Table
CREATE TABLE Borrowers (
    borrower_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    obligor_risk_rating VARCHAR(3),
    description TEXT
);

-- Creating Clients Table
CREATE TABLE Clients (
    client_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    borrower_id INT,
    FOREIGN KEY (borrower_id) REFERENCES Borrowers(borrower_id)
);

-- Creating Departments Table
CREATE TABLE Departments (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Creating Employees Table
CREATE TABLE Employees (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES Departments(department_id)
);

-- Creating Products Table
CREATE TABLE Products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

-- Creating Sales Table
CREATE TABLE Sales (
    sale_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    employee_id INT,
    borrower_id INT,
    amount FLOAT,
    sale_date DATE,
    FOREIGN KEY (product_id) REFERENCES Products(product_id),
    FOREIGN KEY (employee_id) REFERENCES Employees(employee_id),
    FOREIGN KEY (borrower_id) REFERENCES Borrowers(borrower_id),
);

-- Creating EmployeeClient Table
CREATE TABLE EmployeeBorrower (
    employee_id INT,
    borrower_id INT,
    PRIMARY KEY (employee_id, borrower_id),
    FOREIGN KEY (employee_id) REFERENCES Employees(employee_id),
    FOREIGN KEY (borrower_id) REFERENCES Borrowers(borrower_id)
);

-- Creating EmployeeProduct Table
CREATE TABLE EmployeeProduct (
    employee_id INT,
    product_id INT,
    PRIMARY KEY (employee_id, product_id),
    FOREIGN KEY (employee_id) REFERENCES Employees(employee_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
);
