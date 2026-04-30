const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user:  "appuser",
  password:  "Flor3ria@2026!",
  database:  "floreria",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = db;