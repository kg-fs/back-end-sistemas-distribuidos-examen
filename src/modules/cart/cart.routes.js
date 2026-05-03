// modules/cart/cart.routes.js
const express = require('express');
const router = express.Router();
const cartController = require('./cart.controller');

// Crear u obtener carrito del usuario
router.post('/', cartController.createCart);

// Obtener carrito del usuario
router.get('/', cartController.getCart);

// ======================
// RUTAS DE ITEMS DEL CARRITO
// ======================

// Agregar un producto al carrito
router.post('/items', cartController.addItem);

// Obtener todos los items del carrito del usuario
router.get('/items', cartController.getCartItems);

// Actualizar cantidad de un item
router.put('/items', cartController.updateItemQuantity);

// Eliminar un item específico
router.delete('/items', cartController.removeItem);

// Vaciar todo el carrito
router.delete('/clear', cartController.clearCart);

module.exports = router;