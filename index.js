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
app.use(express.urlencoded({ extended: true }));

// ==================== RUTAS ====================
const userRoutes = require('./src/modules/users/user.routes');
const productRoutes = require('./src/modules/products/product.routes');
const cartRoutes = require('./src/modules/cart/cart.routes');
const orderRoutes = require('./src/modules/orders/order.routes');
const paymentRoutes = require('./src/modules/payments/payment.routes');
const pickupRoutes = require('./src/modules/pickup/pickup.routes');
//uso de rutas
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/pickup', pickupRoutes);



app.get('/', (req, res) => {
    res.json({ 
        message: "API de Florería funcionando correctamente",
        version: "1.0.0"
    });
});

app.get("/status", (req, res) => {
  res.json({
    status: "OK",
    server: os.hostname(),
    timestamp: new Date().toISOString()
  });
});

app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 as test");
    res.json(rows);
  } catch (error) {
    res.status(500).json(error.message);
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