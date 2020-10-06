DROP DATABASE IF EXISTS employeetracker_db;

CREATE DATABASE employeetracker_db;

USE employeetracker_db;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(8,2),
    department_id INT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NULL,
    manager_id INT NULL,
    PRIMARY KEY(id)
);
INSERT INTO department (department_name) VALUES ("CEO");
INSERT INTO department (department_name) VALUES ("Sales");
INSERT INTO department (department_name) VALUES ("Legal");
INSERT INTO department (department_name) VALUES ("Finance");
INSERT INTO department (department_name) VALUES ("Engineering");
INSERT INTO department (department_name) VALUES ("Marketing");

select * from department;

INSERT INTO role (title,salary, department_id) VALUES ("ceo", 300000.00, 1);
INSERT INTO role (title,salary, department_id) VALUES ("sales manager", 61000.00, 2);
INSERT INTO role (title,salary, department_id) VALUES ("sales rep", 52000.00, 2);
INSERT INTO role (title,salary, department_id) VALUES ("lawyer", 102000.00, 3);
INSERT INTO role (title,salary, department_id) VALUES ("paralegal", 59000.00, 3);
INSERT INTO role (title,salary, department_id) VALUES ("financial manager", 71000.00, 4);
INSERT INTO role (title,salary, department_id) VALUES ("accountant", 67000.00, 4);
INSERT INTO role (title,salary, department_id) VALUES ("lead engineer", 100000.00, 5);
INSERT INTO role (title,salary, department_id) VALUES ("software engineer", 72000.00, 5);


select * from role;

INSERT INTO employee (first_name, last_name, role_id) VALUES ("James", "Bond", 1);
INSERT INTO employee (first_name, last_name, role_id) VALUES ("Kelly", "Smith", 2);
INSERT INTO employee (first_name, last_name, role_id) VALUES ("Tina", "Harris", 3);
INSERT INTO employee(first_name, last_name, role_id) VALUES ("Daffy", "Duck", 4);
INSERT INTO employee(first_name, last_name, role_id) VALUES ("Bugs", "Bunny", 5);
INSERT INTO employee(first_name, last_name, role_id) VALUES ("Harry", "Potter", 6);
INSERT INTO employee(first_name, last_name, role_id) VALUES ("Peter", "Pan", 7);
INSERT INTO employee(first_name, last_name, role_id) VALUES ("Tony", "Starks", 8);
INSERT INTO employee(first_name, last_name, role_id) VALUES ("Porky", "Pig", 9);

select * from employee;