// modules/products/product.service.js
const db = require('../../config/db');
const { generateProductId } = require('../utils/ids');

// ======================
// CREAR PRODUCTO
// ======================
const createProduct = async (productData) => {
    const Num_product = generateProductId();

    const {
        Name_product,
        Description = null,
        Image_url = null,
        Price,
        Stock = 0,
        Type,
        Num_cat_state = 1
    } = productData;

    // Validación de campos obligatorios
    if (!Name_product || !Price || !Type) {
        throw new Error("Nombre del producto, precio y tipo son obligatorios");
    }

    // 1. Validar que el Nombre del producto no exista ya
    const [existingName] = await db.query(
        `SELECT Num_product FROM products WHERE Name_product = ?`,
        [Name_product]
    );

    if (existingName.length > 0) {
        throw new Error("Ya existe un producto con ese nombre");
    }

    // 2. Validar que el Num_product no exista (por si hay colisión)
    const [existingId] = await db.query(
        `SELECT Num_product FROM products WHERE Num_product = ?`,
        [Num_product]
    );

    if (existingId.length > 0) {
        // Si hay colisión, generamos uno nuevo recursivamente
        return createProduct(productData);
    }

    // Insertar el producto
    const [result] = await db.query(
        `INSERT INTO products 
         (Num_product, Name_product, Description, Image_url, Price, Stock, Type, Num_cat_state) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [Num_product, Name_product, Description, Image_url, Price, Stock, Type, Num_cat_state]
    );

    return { 
        insertId: Num_product, 
        affectedRows: result.affectedRows 
    };
};

// ======================
// OBTENER TODOS LOS PRODUCTOS ACTIVOS
// ======================
const getAllProducts = async () => {
    const [rows] = await db.query(
        `SELECT Num_product, Name_product, Description, Image_url, Price, Stock, Type, Num_cat_state, created_at 
         FROM products 
         WHERE Num_cat_state = 1 
         ORDER BY Num_product DESC`
    );
    return rows;
};

// ======================
// OBTENER PRODUCTO POR ID
// ======================
const getProductById = async (num_product) => {
    const [rows] = await db.query(
        `SELECT * FROM products WHERE Num_product = ?`,
        [num_product]
    );
    return rows[0];
};

// ======================
// ACTUALIZAR PRODUCTO
// ======================
const updateProduct = async (num_product, productData) => {
    const { Name_product, Description, Image_url, Price, Type, Num_cat_state } = productData;

    const [result] = await db.query(
        `UPDATE products 
         SET Name_product = ?, 
             Description = ?, 
             Image_url = ?, 
             Price = ?, 
             Type = ?, 
             Num_cat_state = ?
         WHERE Num_product = ?`,
        [Name_product, Description, Image_url, Price, Type, Num_cat_state, num_product]
    );

    return result;
};

// ======================
// ELIMINAR LÓGICO (Cambiar estado a Inactivo)
// ======================
const deleteProduct = async (num_product) => {
    const [result] = await db.query(
        `UPDATE products 
         SET Num_cat_state = 2 
         WHERE Num_product = ?`,
        [num_product]
    );
    return result;
};

// ======================
// ACTUALIZAR STOCK
// tipo = 1 → Agregar stock
// tipo = 2 → Restar stock
// ======================
const updateStock = async (num_product, cantidad, tipo) => {
    if (tipo !== 1 && tipo !== 2) {
        throw new Error("El tipo debe ser 1 (agregar) o 2 (restar)");
    }

    let sql = '';
    if (tipo === 1) {
        sql = `UPDATE products SET Stock = Stock + ? WHERE Num_product = ?`;
    } else {
        sql = `UPDATE products SET Stock = GREATEST(Stock - ?, 0) WHERE Num_product = ?`;
    }

    const [result] = await db.query(sql, [cantidad, num_product]);
    return result;
};

// ======================
// BUSCAR PRODUCTO POR NOMBRE
// ======================
const searchProductByName = async (name) => {
    const [rows] = await db.query(
        `SELECT Num_product, Name_product, Description, Image_url, Price, Stock, Type, Num_cat_state, created_at 
         FROM products 
         WHERE Name_product LIKE ? 
         AND Num_cat_state = 1
         ORDER BY Name_product ASC`,
        [`%${name}%`]
    );
    return rows;
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

