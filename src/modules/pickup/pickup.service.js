// modules/pickup/pickup.service.js
const db = require('../../config/db');

// ======================
// CREAR PICKUP/ENTREGA
// ======================
const createPickup = async (pickupData) => {
    const { 
        Num_order, 
        Pickup_date, 
        Pickup_time, 
        Status = 'pendiente'
    } = pickupData;

    // Validaciones
    if (!Num_order || !Pickup_date || !Pickup_time) {
        throw new Error("Num_order, Pickup_date y Pickup_time son obligatorios");
    }

    // Generar ID de pickup
    const Num_pickup = Math.floor(Math.random() * 900000) + 100000; // 6 cifras

    // Insertar pickup
    const [result] = await db.query(
        `INSERT INTO pickup_orders 
         (Num_pickup, Num_order, Pickup_date, Pickup_time, Status) 
         VALUES (?, ?, ?, ?, ?)`,
        [Num_pickup, Num_order, Pickup_date, Pickup_time, Status]
    );

    return {
        Num_pickup,
        Num_order,
        Pickup_date,
        Pickup_time,
        Status,
        insertId: result.insertId
    };
};

// ======================
// OBTENER TODOS LOS PICKUPS CON NOMBRE DE USUARIO
// ======================
const getAllPickups = async () => {
    const [pickups] = await db.query(`
        SELECT 
            p.Num_pickup,
            p.Num_order,
            p.Pickup_date,
            p.Pickup_time,
            p.Status,
            p.created_at,
            o.Total as order_total,
            o.Status as order_status,
            CONCAT(u.Firs_name_user, ' ', u.Last_name_user) as user_name,
            u.Email as user_email,
            u.Num_user
        FROM pickup_orders p
        JOIN orders o ON p.Num_order = o.Num_order
        JOIN users u ON o.Num_user = u.Num_user
        ORDER BY p.created_at DESC
    `);
    
    return pickups;
};

// ======================
// OBTENER PICKUPS POR ORDEN
// ======================
const getPickupsByOrder = async (Num_order) => {
    const [pickups] = await db.query(`
        SELECT 
            p.Num_pickup,
            p.Num_order,
            p.Pickup_date,
            p.Pickup_time,
            p.Status,
            p.created_at,
            o.Total as order_total,
            o.Status as order_status,
            CONCAT(u.Firs_name_user, ' ', u.Last_name_user) as user_name,
            u.Email as user_email,
            u.Num_user
        FROM pickup_orders p
        JOIN orders o ON p.Num_order = o.Num_order
        JOIN users u ON o.Num_user = u.Num_user
        WHERE p.Num_order = ?
        ORDER BY p.created_at DESC
    `, [Num_order]);
    
    return pickups;
};

// ======================
// OBTENER PICKUPS POR USUARIO
// ======================
const getPickupsByUser = async (Num_user) => {
    const [pickups] = await db.query(`
        SELECT 
            p.Num_pickup,
            p.Num_order,
            p.Pickup_date,
            p.Pickup_time,
            p.Status,
            p.created_at,
            o.Total as order_total,
            o.Status as order_status,
            CONCAT(u.Firs_name_user, ' ', u.Last_name_user) as user_name,
            u.Email as user_email,
            u.Num_user
        FROM pickup_orders p
        JOIN orders o ON p.Num_order = o.Num_order
        JOIN users u ON o.Num_user = u.Num_user
        WHERE o.Num_user = ?
        ORDER BY p.created_at DESC
    `, [Num_user]);
    
    return pickups;
};

// ======================
// OBTENER PICKUPS POR ESTADO
// ======================
const getPickupsByStatus = async (status) => {
    const validStatuses = ['pendiente', 'entregado'];
    if (!validStatuses.includes(status)) {
        throw new Error("El status debe ser 'pendiente' o 'entregado'");
    }

    const [pickups] = await db.query(`
        SELECT 
            p.Num_pickup,
            p.Num_order,
            p.Pickup_date,
            p.Pickup_time,
            p.Status,
            p.created_at,
            o.Total as order_total,
            o.Status as order_status,
            CONCAT(u.Firs_name_user, ' ', u.Last_name_user) as user_name,
            u.Email as user_email,
            u.Num_user
        FROM pickup_orders p
        JOIN orders o ON p.Num_order = o.Num_order
        JOIN users u ON o.Num_user = u.Num_user
        WHERE p.Status = ?
        ORDER BY p.created_at DESC
    `, [status]);
    
    return pickups;
};

module.exports = {
    createPickup,
    getAllPickups,
    getPickupsByOrder,
    getPickupsByUser,
    getPickupsByStatus
};