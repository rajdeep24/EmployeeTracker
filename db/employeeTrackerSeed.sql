DROP DATABASE IF EXISTS employees_DB;

CREATE DATABASE employees_DB;

USE employees_DB;

----- Create Department table -----
CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

----- Create Role Table -----
CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);

----- Create Employee Table -----
CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
    FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE CASCADE
);

USE employees_DB;

----- Department Seeds -----

INSERT INTO department (id, name)
VALUES (1, "Sales");

INSERT INTO department (id, name)
VALUES (2, "Marketing");

INSERT INTO department (id, name)
VALUES (3, "Human Resources");

INSERT INTO department (id, name)
VALUES (4, "Finance");

----- Role Seeds -----

INSERT INTO role (id, title, salary, department_id)
VALUES (1, "Sales Associate", 42000, 1);

INSERT INTO role (id, title, salary, department_id)
VALUES (2, "Sales Lead", 60000, 1);

INSERT INTO role (id, title, salary, department_id)
VALUES (3, "Account Manager", 75000, 1);

INSERT INTO role (id, title, salary, department_id)
VALUES (4, "Marketing Manager", 65000, 2);

INSERT INTO role (id, title, salary, department_id)
VALUES (5, "HR Recruiter", 70000, 3);

INSERT INTO role (id, title, salary, department_id)
VALUES (6, "HR Manager", 100000, 3);

INSERT INTO role (id, title, salary, department_id)
VALUES (7, "Lead Accountant", 80000, 4);

INSERT INTO role (id, title, salary, department_id)
VALUES (8, "Accountant", 52000, 4);

INSERT INTO role (id, title, salary, department_id)
VALUES (9, "Financial Manager", 105000, 4);

----- Employees Seeds -----

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (3, "Daffy", "Duck", 3, null);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (4, "Donald", "Duck", 4, null);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (6, "Lebron", "James", 6, null);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (9, "Jim", "Jones", 9, null);

INSERT INTO employee (id,first_name, last_name, role_id, manager_id)
VALUES ( 1, "James", "Bond", 1, 3);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (2, "Kim", "Kardashian", 2, 3);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (5, "Porky", "Pig", 5, 6);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (7, "Gilbert", "Arenas", 7, 9);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (8, "Tom", "Brady", 8, 9);

select * from employee;
