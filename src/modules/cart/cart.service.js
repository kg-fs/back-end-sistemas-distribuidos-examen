const db = require('../../config/db');
const { generateCartId } = require('../utils/ids');

const createCartIfNotExists = async (num_user) => {
    // 1. Verificar si el usuario ya tiene un carrito
    const [existingCart] = await db.query(
        `SELECT Num_cart FROM carts WHERE Num_user = ?`,
        [num_user]
    );

    if (existingCart.length > 0) {
        return existingCart[0].Num_cart;   // Retorna el carrito existente
    }

    // 2. Generar un nuevo ID y validar que no exista
    let Num_cart;
    let attempts = 0;
    const maxAttempts = 5;

    do {
        Num_cart = generateCartId();
        attempts++;

        // Verificar si el ID generado ya existe
        const [existingId] = await db.query(
            `SELECT Num_cart FROM carts WHERE Num_cart = ?`,
            [Num_cart]
        );

        if (existingId.length === 0) {
            // ID único encontrado, salir del bucle
            break;
        }

        // Si llegamos al máximo de intentos, lanzamos error
        if (attempts >= maxAttempts) {
            throw new Error("No se pudo generar un ID único para el carrito");
        }
    } while (true);

    // 3. Crear el nuevo carrito
    await db.query(
        `INSERT INTO carts (Num_cart, Num_user) VALUES (?, ?)`,
        [Num_cart, num_user]
    );

    return Num_cart;
};

const getCartByUser = async (num_user) => {
    const [cart] = await db.query(
        `SELECT 
            c.Num_cart,
            CONCAT(u.Firs_name_user, ' ', u.Last_name_user) as user_name,
            u.Email as user_email
         FROM carts c
         JOIN users u ON c.Num_user = u.Num_user
         WHERE c.Num_user = ?`,
        [num_user]
    );

    if (cart.length === 0) {
        return null;
    }

    return cart[0];
};

//service de carts items

// ======================
// AGREGAR ITEM AL CARRITO
// ======================
const addItemToCart = async (num_cart, num_product, quantity = 1) => {
    // Verificar si el item ya existe en el carrito
    const [existing] = await db.query(
        `SELECT Num_cart_item, Quantity FROM cart_items 
         WHERE Num_cart = ? AND Num_product = ?`,
        [num_cart, num_product]
    );

    if (existing.length > 0) {
        // Actualizar cantidad
        // pendiente comprobar si el items existe
        const newQuantity = existing[0].Quantity + quantity;
        await db.query(
            `UPDATE cart_items SET Quantity = ? WHERE Num_cart = ? AND Num_product = ?`,
            [newQuantity, num_cart, num_product]
        );
        return { message: "Cantidad actualizada" };
    }

    // Crear nuevo item
    const Num_cart_item = Math.floor(Math.random() * 90000) + 10000;

    await db.query(
        `INSERT INTO cart_items (Num_cart_item, Num_cart, Num_product, Quantity) 
         VALUES (?, ?, ?, ?)`,
        [Num_cart_item, num_cart, num_product, quantity]
    );

    return { message: "Producto agregado al carrito" };
};

// ======================
// OBTENER TODOS LOS ITEMS DEL CARRITO
// ======================
const getCartItems = async (num_cart) => {
    const [items] = await db.query(
        `SELECT ci.Num_cart_item, ci.Quantity, p.Num_product, p.Name_product, 
                p.Price, p.Image_url, p.Stock
         FROM cart_items ci
         JOIN products p ON ci.Num_product = p.Num_product
         WHERE ci.Num_cart = ?`,
        [num_cart]
    );
    return items;
};

// ======================
// OBTENER TODOS LOS ITEMS DEL CARRITO CON INFO DEL USUARIO
// ======================
const getCartItemsWithUserInfo = async (num_cart) => {
    const [items] = await db.query(
        `SELECT 
            ci.Num_cart_item, 
            ci.Quantity, 
            p.Num_product, 
            p.Name_product, 
            p.Price, 
            p.Image_url, 
            p.Stock,
            CONCAT(u.Firs_name_user, ' ', u.Last_name_user) as user_name,
            u.Email as user_email
         FROM cart_items ci
         JOIN products p ON ci.Num_product = p.Num_product
         JOIN carts c ON ci.Num_cart = c.Num_cart
         JOIN users u ON c.Num_user = u.Num_user
         WHERE ci.Num_cart = ?`,
        [num_cart]
    );
    return items;
};

const updateCartItemQuantity = async (num_cart_item, quantity) => {
    const [result] = await db.query(
        `UPDATE cart_items SET Quantity = ? WHERE Num_cart_item = ?`,
        [quantity, num_cart_item]
    );
    return result;
};

const removeCartItem = async (num_cart_item) => {
    const [result] = await db.query(
        `DELETE FROM cart_items WHERE Num_cart_item = ?`,
        [num_cart_item]
    );
    return result;
};

// ======================
// VACIAR TODO EL CARRITO
// ======================
const clearCart = async (num_cart) => {
    const [result] = await db.query(
        `DELETE FROM cart_items WHERE Num_cart = ?`,
        [num_cart]
    );
    return result;
};

module.exports = {
    createCartIfNotExists,
    getCartByUser,
    addItemToCart,
    getCartItems,
    getCartItemsWithUserInfo,
    updateCartItemQuantity,
    removeCartItem,
    clearCart
};
