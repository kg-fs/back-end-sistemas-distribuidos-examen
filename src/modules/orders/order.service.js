// modules/orders/order.service.js
const db = require('../../config/db');

// ======================
// CREAR ORDEN (CHECKOUT)
// ======================
const checkout = async (num_user) => {
    // 1. Obtener el carrito del usuario
    const [cart] = await db.query(
        `SELECT Num_cart FROM carts WHERE Num_user = ?`,
        [num_user]
    );

    if (cart.length === 0) {
        throw new Error("El usuario no tiene carrito");
    }

    const num_cart = cart[0].Num_cart;

    // 2. Obtener items del carrito
    const [items] = await db.query(
        `SELECT ci.Num_product, ci.Quantity, p.Price 
         FROM cart_items ci
         JOIN products p ON ci.Num_product = p.Num_product
         WHERE ci.Num_cart = ?`,
        [num_cart]
    );

    if (items.length === 0) {
        throw new Error("El carrito está vacío");
    }

    // 3. Calcular total
    let total = 0;
    items.forEach(item => {
        total += item.Price * item.Quantity;
    });

    // 4. Crear la orden
    const Num_order = Math.floor(Math.random() * 900000) + 100000; // 6 cifras

    const [orderResult] = await db.query(
        `INSERT INTO orders (Num_order, Num_user, Total, Status) 
         VALUES (?, ?, ?, 'pagado')`,
        [Num_order, num_user, total]
    );

    // 5. Copiar items a order_items
    for (const item of items) {
        await db.query(
            `INSERT INTO order_items (Num_order, Num_product, Quantity, Price) 
             VALUES (?, ?, ?, ?)`,
            [Num_order, item.Num_product, item.Quantity, item.Price]
        );
    }

    // 6. (Opcional) Vaciar carrito
    await db.query(`DELETE FROM cart_items WHERE Num_cart = ?`, [num_cart]);

    return {
        Num_order,
        total,
        items_count: items.length
    };
};
const getUserOrders = async (num_user) => {
    const [orders] = await db.query(
        `SELECT 
            o.Num_order, 
            o.Total, 
            o.Status, 
            o.created_at,
            CONCAT(u.Firs_name_user, ' ', u.Last_name_user) as user_name,
            u.Email as user_email
         FROM orders o
         JOIN users u ON o.Num_user = u.Num_user
         WHERE o.Num_user = ? 
         ORDER BY o.created_at DESC`,
        [num_user]
    );
    return orders;
};
// ======================
// OBTENER DETALLE DE UNA ORDEN (por Header)
// ======================
const getOrderDetail = async (num_order) => {
    const [order] = await db.query(
        `SELECT 
            o.Num_order, 
            o.Num_user, 
            o.Total, 
            o.Status, 
            o.created_at,
            CONCAT(u.Firs_name_user, ' ', u.Last_name_user) as user_name,
            u.Email as user_email
         FROM orders o
         JOIN users u ON o.Num_user = u.Num_user
         WHERE o.Num_order = ?`,
        [num_order]
    );

    if (order.length === 0) return null;

    const [items] = await db.query(
        `SELECT 
            oi.Num_order_item,
            oi.Quantity,
            oi.Price,
            p.Name_product
         FROM order_items oi
         JOIN products p ON oi.Num_product = p.Num_product
         WHERE oi.Num_order = ?`,
        [num_order]
    );

    return {
        ...order[0],
        items
    };
};
// ======================
// OBTENER TODAS LAS ÓRDENES (Admin)
// ======================
const getAllOrders = async () => {
    const [orders] = await db.query(`
        SELECT 
            o.Num_order, 
            o.Num_user, 
            o.Total, 
            o.Status, 
            o.created_at,
            CONCAT(u.Firs_name_user, ' ', u.Last_name_user) as user_name,
            u.Email as user_email
         FROM orders o
         JOIN users u ON o.Num_user = u.Num_user
         ORDER BY o.created_at DESC
    `);
    return orders;
};

// ======================
// ACTUALIZAR ESTADO DE LA ORDEN (para Admin)
// ======================
const updateOrderStatus = async (num_order, status) => {
    const [result] = await db.query(
        `UPDATE orders SET Status = ? WHERE Num_order = ?`,
        [status, num_order]
    );
    return result;
};
module.exports = {
    checkout,
    getUserOrders,
    getOrderDetail,
    getAllOrders,
    updateOrderStatus
};
