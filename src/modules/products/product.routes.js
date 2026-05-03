// modules/products/product.routes.js
const express = require('express');
const router = express.Router();
const productController = require('./product.controller');

// ======================
// RUTAS PARA PRODUCTOS 
// ======================

// Crear producto
router.post('/', productController.createProduct);

// Obtener todos los productos
router.get('/', productController.getAllProducts);

// Obtener un producto por ID (desde header)
router.get('/detail', productController.getProductById);

// Actualizar producto
router.put('/update', productController.updateProduct);

// Eliminar lógico (cambiar a inactivo)
router.delete('/delete', productController.deleteProduct);

// Actualizar stock
router.post('/stock', productController.updateStock);

// Buscar producto por nombre (usando query string)
router.get('/search', productController.searchProductByName);

module.exports = router;