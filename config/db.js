const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "apiPet",
  password: "",
});
connection.connect();
module.exports = connection;
