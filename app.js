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
			choices: ["View ALL Employees", "View All Employees by Department", "View All Roles", "Add Employee", "Remove Employee", "Update Employee Manager", "Exit"],
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

// removes employee from database
function removeEmployee() {
	inquirer
		.prompt([
			{
				name: "first_name",
				type: "input",
				message: "What is your Employee's First Name?",
			},
			{
				name: "last_name",
				type: "input",
				message: "What is your Employee's Last Name?",
			},
		])
		.then(function (answer) {
			connection.query("DELETE FROM employee WHERE first_name = ? and last_name = ?", [answer.first_name, answer.last_name], function (err) {
				if (err) throw err;

				console.log(`\n ${answer.first_name} ${answer.last_name} has been deleted from the database... \n`);
				promptQuit();
			});
		});
}

// Displays a Table based on the User's Choice
createTable = (sql) => {
	connection.query(sql, (err, res) => {
		if (err) throw err;
		console.table(res);
		start();
	});
};
// Creates an array of Current Employees
createEmployeesArray = (array) => {
	return array.map((array) => {
		return `${array.first_name} ${array.last_name}`;
	});
};

// Creates an array of Current Roles
createRolesArray = (array) => {
	return [
		...new Set(
			array.map((array) => {
				return array.title;
			})
		),
	];
};
// Updates an Employee's Manager in the Database
updateEmployeeManager = () => {
	// Retrieves a Table of Employees from the Database
	connection.query(`SELECT employee.id, employee.first_name, employee.last_name FROM employee`, (err, result) => {
		if (err) throw err;
		// Creates an array of Current Employees
		const currentEmployeesArray = createEmployeesArray(result);

		inquirer
			.prompt([
				{
					name: "employee",
					type: "list",
					message: "Which employee would you like to update?",
					choices: currentEmployeesArray,
				},
				{
					name: "manager",
					type: "list",
					message: "Which employee will become the selected employee's manager?",
					choices: currentEmployeesArray,
				},
			])
			.then((response) => {
				// Splits the Employee Array into First Name and Last Name
				const employeeArray = response.employee.split(" ");
				const employeeFirstName = employeeArray[0];
				const employeeLastName = employeeArray[1];

				// Splits the Manager Array into First Name and Last Name
				const managerArray = response.manager.split(" ");
				const managerFirstName = managerArray[0];
				const managerLastName = managerArray[1];

				// Retrieves the correct roleId and ManagerId from the database
				let managerId;
				for (let i = 0; i < result.length; i++) {
					if (managerFirstName === result[i].first_name && managerLastName === result[i].last_name) {
						managerId = result[i].id;
					}
				}

				// Updates an Employee's Manager in the Database
				connection.query(`UPDATE employee SET manager_id = ? WHERE employee.first_name = ? AND employee.last_name = ?`, [managerId, employeeFirstName, employeeLastName], (err, res) => {
					if (err) throw err;
					start();
				});
			})
			.catch((error) => {
				console.log(error);
			});
	});
};

function promptQuit() {
	inquirer
		.prompt({
			type: "list",
			name: "promptQuit",
			message: "Would you like to quit this application or run again?",
			choices: ["Run Again", "Quit"],
		})
		.then(function (answer) {
			if (answer.promptQuit === "Run Again") {
				start();
			} else {
				connection.end();
			}
		});
}
