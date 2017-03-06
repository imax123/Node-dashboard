var mysql = require('mysql');

// First you need to create a connection to the db
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "imax",
  database: "nodeAdmin"
});

module.exports = connection;