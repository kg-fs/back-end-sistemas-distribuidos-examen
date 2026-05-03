// modules/products/product.controller.js
const productService = require('./product.service');

// ======================
// CREAR PRODUCTO
// ======================
const createProduct = async (req, res) => {
    try {
        const result = await productService.createProduct(req.body);

        res.status(201).json({
            success: true,
            message: "Producto creado correctamente",
            insertId: result.insertId
        });
    } catch (error) {
        console.error('Error en createProduct:', error);
        res.status(500).json({
            success: false,
            message: "Error al crear el producto",
            error: error.message
        });
    }
};

// ======================
// OBTENER TODOS LOS PRODUCTOS
// ======================
const getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        console.error('Error en getAllProducts:', error);
        res.status(500).json({
            success: false,
            message: "Error al obtener los productos",
            error: error.message
        });
    }
};

// ======================
// OBTENER UN PRODUCTO POR ID (desde Header)
// ======================
const getProductById = async (req, res) => {
    try {
        const num_product = req.headers['x-product-id'];

        if (!num_product) {
            return res.status(400).json({
                success: false,
                message: "Se requiere el header 'x-product-id'"
            });
        }

        const product = await productService.getProductById(num_product);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Producto no encontrado"
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Error en getProductById:', error);
        res.status(500).json({
            success: false,
            message: "Error al obtener el producto",
            error: error.message
        });
    }
};

// ======================
// ACTUALIZAR PRODUCTO (desde Header)
// ======================
const updateProduct = async (req, res) => {
    try {
        const num_product = req.headers['x-product-id'];

        if (!num_product) {
            return res.status(400).json({
                success: false,
                message: "Se requiere el header 'x-product-id'"
            });
        }

        const result = await productService.updateProduct(num_product, req.body);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Producto no encontrado"
            });
        }

        res.status(200).json({
            success: true,
            message: "Producto actualizado correctamente"
        });
    } catch (error) {
        console.error('Error en updateProduct:', error);
        res.status(500).json({
            success: false,
            message: "Error al actualizar el producto",
            error: error.message
        });
    }
};

// ======================
// ELIMINAR LÓGICO
// ======================
const deleteProduct = async (req, res) => {
    try {
        const num_product = req.headers['x-product-id'];

        if (!num_product) {
            return res.status(400).json({
                success: false,
                message: "Se requiere el header 'x-product-id'"
            });
        }

        const result = await productService.deleteProduct(num_product);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Producto no encontrado"
            });
        }

        res.status(200).json({
            success: true,
            message: "Producto eliminado correctamente (estado inactivo)"
        });
    } catch (error) {
        console.error('Error en deleteProduct:', error);
        res.status(500).json({
            success: false,
            message: "Error al eliminar el producto",
            error: error.message
        });
    }
};

// ======================
// ACTUALIZAR STOCK
// ======================
const updateStock = async (req, res) => {
    try {
        const num_product = req.headers['x-product-id'];
        const { cantidad, tipo } = req.body;

        if (!num_product) {
            return res.status(400).json({
                success: false,
                message: "Se requiere el header 'x-product-id'"
            });
        }

        if (!cantidad || !tipo) {
            return res.status(400).json({
                success: false,
                message: "Se requiere 'cantidad' y 'tipo' (1=agregar, 2=restar)"
            });
        }

        const result = await productService.updateStock(num_product, cantidad, tipo);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Producto no encontrado"
            });
        }

        const accion = tipo === 1 ? "agregado" : "restado";
        res.status(200).json({
            success: true,
            message: `Stock ${accion} correctamente`
        });
    } catch (error) {
        console.error('Error en updateStock:', error);
        res.status(500).json({
            success: false,
            message: "Error al actualizar el stock",
            error: error.message
        });
    }
};

const searchProductByName = async (req, res) => {
    try {
        const name = req.headers['x-product-name'];

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Se requiere el header 'x-product-name'"
            });
        }

        const products = await productService.searchProductByName(name);

        res.status(200).json({
            success: true,
            count: products.length,
            message: `Se encontraron ${products.length} productos`,
            data: products
        });
    } catch (error) {
        console.error('Error en searchProductByName:', error);
        res.status(500).json({
            success: false,
            message: "Error al buscar productos por nombre",
            error: error.message
        });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    updateStock,
    searchProductByName     
};

