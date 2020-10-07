//Dependencies
const inquirer = require("inquirer");
const mysql = require("mysql");
const consoleTable = require("console.table");

//create the connection information for the sql database
const connection = mysql.createConnection({
	host: "localhost",
	// Your port; if not 3306
	port: 3306,
	// Your username
	user: "root",
	// Your password
	password: "rajdeepkakar",
	database: "employees_db",
});

// connect to the mysql server and sql database
connection.connect(function (err) {
	if (err) throw err;
	// run the start function after the connection is made to prompt the user
	console.log("Connected to port:");
	start();
});

//function which prompts the user for what action they should take
function start() {
	inquirer
		.prompt({
			name: "action",
			type: "list",
			message: "Would you like to do?",
			choices: ["View ALL Employees", "View All Employees by Department", "View All Employees by Manager", "Add Employee", "Remove Employee", "Update Employee Role", "Update Employee Manager", "Exit"],
		})
		.then(function (answer,) {
			switch (answer.action) {
				case "View ALL Employees":
					viewAllEmployees();
					break;

				case "View All Employees by Department":
					viewAllEmployeesByDept();
					break;

				case "View All Employees by Manager":
					viewAllEmployeesByManager();
					break;

				case "Add Employee":
					addEmployee();
					break;

				case "Remove Employee":
					removeEmployee();
					break;

				case "Update Employee Role":
					updateEmployeeRole();
					break;

				case "Update Employee Manager":
					updateEmployeeManager();
					break;

				case "exit":
					connection.end();
					break;
			}
		});
}

//View all employees function

function viewAllEmployees() {
	const query =
    "SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, concat(m.first_name, ' ' ,  m.last_name) AS manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id ORDER BY ID ASC";
    
  
	connection.query(query, function (err, res) {
		if (err) throw err;
    
    //Display the query results to console using console.table
    console.table(res)

    //Return to the start menu
		start();
	});
}

function viewAllEmployeesByDept() {

};

function viewAllEmployeesByManager() {

};

function addEmployee() {

};

function removeEmployee() {

};

function updateEmployeeRole() {

};

function updateEmployeeManager() {
  
};


