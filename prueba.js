require("dotenv").config();
const express = require("express");
const os = require("os");
const cors = require("cors");


const app = express();
const PORT = process.env.PORT || 3000;

// ==================== MIDDLEWARE ====================
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// ==================== SUPABASE ====================


// ==================== RUTAS ====================

// Health check (IMPORTANTE para VPS)
app.get("/", (req, res) => {
  res.json({
    message: "API funcionando 🚀",
    server: os.hostname()
  });
});

app.get("/status", (req, res) => {
  res.json({
    status: "OK",
    server: os.hostname(),
    timestamp: new Date().toISOString()
  });
});



// ==================== MANEJO GLOBAL DE ERRORES ====================
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
});

// ==================== INICIAR SERVIDOR ====================
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor ${os.hostname()} corriendo en puerto ${PORT}`);
});