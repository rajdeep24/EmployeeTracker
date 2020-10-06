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
	database: "employeetracker_db",
});

// connect to the mysql server and sql database
connection.connect(function (err) {
	if (err) throw err;
	// run the start function after the connection is made to prompt the user
	console.log("Connected to port:");
	start();
});
