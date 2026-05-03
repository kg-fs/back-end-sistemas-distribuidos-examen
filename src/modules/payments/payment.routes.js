// modules/payments/payment.routes.js
const express = require('express');
const router = express.Router();
const paymentController = require('./payment.controller');

// ======================
// ENDPOINTS DE PAGOS
// ======================

// Crear un nuevo pago
router.post('/create', paymentController.createPayment);

// Obtener todos los pagos (con nombre de usuario)
router.get('/', paymentController.getAllPayments);

// Obtener pagos por orden específica
router.get('/order', paymentController.getPaymentsByOrder);

// Obtener pagos por usuario específico
router.get('/user', paymentController.getPaymentsByUser);

module.exports = router;