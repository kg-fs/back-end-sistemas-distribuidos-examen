require("dotenv").config();
const express = require("express");
const os = require("os");
const cors = require("cors");
const db = require("./src/config/db");


const app = express();
const PORT = process.env.PORT || 3000;

// ==================== MIDDLEWARE ====================
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());




app.get("/status", (req, res) => {
  res.json({
    status: "OK",
    server: os.hostname(),
    timestamp: new Date().toISOString()
  });
});

app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT NOW() AS fecha");

    res.json({
      message: "Conexión exitosa 🎉",
      fecha: rows[0].fecha
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error conectando a la DB ❌",
      error: error.message
    });
  }
});



// ==================== MANEJO GLOBAL DE ERRORES ====================
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
});

// ==================== INICIAR SERVIDOR ====================
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor ${os.hostname()} corriendo en puerto ${PORT}`);
});