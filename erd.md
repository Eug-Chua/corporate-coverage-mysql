Borrowers
---------
+ borrower_id (PK)
+ name
+ obligor_risk_rating
+ description

Clients
-------
+ client_id (PK)
+ first_name
+ last_name
+ borrower_id (FK to Borrowers)

Departments
-----------
+ department_id (PK)
+ name

Employees
---------
+ employee_id (PK)
+ first_name
+ last_name
+ department_id (FK to Departments)

Products
--------
+ product_id (PK)
+ name
+ description

Sales
-----
+ sale_id (PK)
+ product_id (FK to Products)
+ employee_id (FK to Employees)
+ borrower_id (FK to Borrowers)
+ amount
+ sale_date

EmployeeBorrower
----------------
+ employee_id (FK to Employees, part of PK)
+ borrower_id (FK to Borrowers, part of PK)

EmployeeProduct
---------------
+ employee_id (FK to Employees, part of PK)
+ product_id (FK to Products, part of PK)
