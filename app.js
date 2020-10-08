//Dependencies
const inquirer = require("inquirer");
const mysql = require("mysql");
const consoleTable = require("console.table");
const figlet = require("figlet");

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

//Run the figlet program to display the start-up screen
connection.connect(function (err) {
	if (err) throw err;
	console.log("connected as id " + connection.threadId);
	// opening design
	figlet.text(
		"Raj Kakar",
		{
			font: "doh",
			horizontalLayout: "default",
			verticalLayout: "default",
			width: 100,
			whitespaceBreak: true,
		},
		function (err, data) {
			if (err) {
				console.log("Something went wrong...");
				console.dir(err);
				return;
			}
			console.log(data);
			//begin questions
			start();
		}
	);
});

//function which prompts the user for what action they should take
function start() {
	inquirer
		.prompt({
			name: "action",
			type: "list",
			message: "Would you like to do?",
			choices: ["View ALL Employees", "View All Employees by Department", "View All Roles", "Add Employee", "Remove Employee", "Update Employee Role", "Update Employee Manager", "Exit"],
		})
		.then(function (answer) {
			switch (answer.action) {
				case "View ALL Employees":
					viewAllEmployees();
					break;

				case "View All Employees by Department":
					viewAllEmployeesByDept();
					break;

				case "View All Roles":
					viewAllRoles();
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

function viewAllEmployeesByDept() {
	connection.query("Select * from department", (err, data) => {
		if (err) throw err;
		console.log(data);
		const formattedData = data.map((object) => {
			let newObject = {};
			newObject.name = object.name;
			newObject.value = object.id;
			return newObject;
		});
		console.log(formattedData);
		inquirer
			.prompt([
				{
					name: "department",
					message: "Which department would you like to search?",
					type: "list",
					choices: formattedData,
				},
			])
			.then((response) => {
				console.log(response);
				connection.query(`Select a.name, c.first_name, c.last_name from department a, role b, employee c where a.id = b.department_id and b.id = c.role_id and a.id = ?;`, [response.department], (err, data) => {
					if (err) throw err;
					console.table(data);
					start();
				});
			});
	});
}

function viewAllEmployees() {
	const query = `SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, concat(m.first_name, ' ' ,  m.last_name) AS manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id ORDER BY ID ASC`;

	connection.query(query, function (err, res) {
		if (err) throw err;

		//display the query results to console using console.table
		console.table(res);

		//Return to the start menu
		start();
	});
}

function viewAllRoles() {
	connection.query("SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id;", function (err, res) {
		if (err) throw err;
		console.table(res);
		start();
	});
}

let rolesArray = ["Sales Associate", "Sales Lead", "Account Manager", "Marketing Manager", "HR Recruiter", "HR Manager", "Lead Accountant", "Accountant", "Financial Manager"];
//get employee names

// function addEmployee() {
// 	inquirer
// 		.prompt([
// 			{
// 				type: "input",
// 				message: "What is the employee's first name?",
// 				name: "first_name",
// 			},
// 			{
// 				type: "input",
// 				message: "What is the employee's last name?",
// 				name: "last_name",
// 			},
// 			{
// 				type: "list",
// 				message: "What is the employee's role?",
// 				name: "role",
// 				choices: rolesArray,
// 			},
// 		])
// 		.then(function (choice) {
// 			if (choice.role === "Sales Associate") {
// 				role_id = 1;
// 				manager_id = 3;
// 			} else if (choice.role === "Sales Lead") {
// 				role_id = 2;
// 				manager_id = 3;
// 			} else if (choice.role === "Account Manager") {
// 				role_id = 3;
// 				manager_id = null;
// 			} else if (choice.role === "Marketing Manager") {
// 				role_id = 4;
// 				manager_id = null;
// 			} else if (choice.role === "HR Recruiter") {
// 				role_id = 5;
// 				manager_id = 6;
// 			} else if (choice.role === "HR Manager") {
// 				role_id = 6;
// 				manager_id = null;
// 			} else if (choice.role === "Lead Accountant") {
// 				role_id = 7;
// 				manager_id = 9;
// 			} else if (choice.role === "Accountant") {
// 				role_id = 8;
// 				manager_id = 9;
// 			} else if (choice.role === "Financial Manager") {
// 				role_id = 9;
// 				manager_id = null;
// 			}
// 			addEmployeeChoice(choice.first, choice.last, role_id, manager_id);
// 			console.log("The Employee has been added");
// 		});
// }

// function addEmployeeChoice(first_name, last_name, role_id, manager_id) {
// 	connection.query(
// 		`INSERT INTO employee (first_name, last_name, role_id, manager_id)
// 		VALUES(${first_name}, ${last_name}, ${role_id},${manager_id})`,
// 		function (err, res) {
// 			if (err) throw err;
// 		}
// 	);
// }

function addEmployee() {
	connection.query("SELECT * FROM role", function (err, result) {
		if (err) throw err;

		inquirer
			.prompt([
				{
					name: "firstName",
					type: "input",
					message: "Enter the employee's First Name:",
				},
				{
					name: "lastName",
					type: "input",
					message: "Enter the employee's Last Name:",
				},
				{
					name: "roleChoice",
					type: "rawlist",
					message: "Enter the employee's role",
					choices: function () {
						const choicesArray = [];

						for (let i = 0; i < result.length; i++) {
							choicesArray.push(result[i].title);
						}

						return choicesArray;
					},
				},
			])
			.then(function (answer) {
				connection.query("SELECT * FROM role WHERE ?", { title: answer.roleChoice }, function (err, result) {
					if (err) throw err;

					connection.query("INSERT INTO employee SET ?", {
						first_name: answer.firstName,
						last_name: answer.lastName,
						role_id: result[0].id,
					});

					console.log("\n Employee added to database... \n");
				});
				viewAllEmployees();
				start();
			});
	});
}

// function removeEmployee() {}

// function updateEmployeeRole() {}

// function updateEmployeeManager() {}
