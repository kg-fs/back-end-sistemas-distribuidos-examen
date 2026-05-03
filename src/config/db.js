const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "127.0.0.1",   // mejor que localhost (evita problemas IPv6)
  port: 3307,          // 🔥 IMPORTANTE: puerto del túnel SSH
  user: "appuser",
  password: "Flor3ria@2026!",
  database: "floreria",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = db;