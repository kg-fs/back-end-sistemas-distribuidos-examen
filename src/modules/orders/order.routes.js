// modules/orders/order.routes.js
const express = require('express');
const router = express.Router();
const orderController = require('./order.controller');

router.post('/checkout', orderController.checkout);
router.get('/user', orderController.getUserOrders);           // Mis órdenes
router.get('/detail', orderController.getOrderDetail);        // Detalle de orden
router.put('/status', orderController.updateOrderStatus);     // Cambiar estado

module.exports = router;