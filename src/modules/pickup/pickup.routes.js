// modules/pickup/pickup.routes.js
const express = require('express');
const router = express.Router();
const pickupController = require('./pickup.controller');

// ======================
// ENDPOINTS DE PICKUPS/ENTREGAS
// ======================

// Crear un nuevo pickup/entrega
router.post('/create', pickupController.createPickup);

// Obtener todos los pickups (con nombre de usuario)
router.get('/', pickupController.getAllPickups);

// Obtener pickups por orden específica
router.get('/order', pickupController.getPickupsByOrder);

// Obtener pickups por usuario específico
router.get('/user', pickupController.getPickupsByUser);

// Obtener pickups por estado (pendiente/entregado)
router.get('/status', pickupController.getPickupsByStatus);

module.exports = router;