// modules/payments/payment.service.js
const db = require('../../config/db');

// ======================
// CREAR PAGO
// ======================
const createPayment = async (paymentData) => {
    const { 
        Num_order, 
        Payment_method, 
        Payment_status = 'completado', 
        Transaction_id 
    } = paymentData;

    // Validaciones
    if (!Num_order || !Payment_method) {
        throw new Error("Num_order y Payment_method son obligatorios");
    }

    // Generar ID de pago
    const Num_payment = Math.floor(Math.random() * 900000) + 100000; // 6 cifras

    // Insertar pago
    const [result] = await db.query(
        `INSERT INTO payments 
         (Num_payment, Num_order, Payment_method, Payment_status, Transaction_id) 
         VALUES (?, ?, ?, ?, ?)`,
        [Num_payment, Num_order, Payment_method, Payment_status, Transaction_id]
    );

    return {
        Num_payment,
        Num_order,
        Payment_method,
        Payment_status,
        Transaction_id,
        insertId: result.insertId
    };
};

// ======================
// OBTENER TODOS LOS PAGOS CON NOMBRE DE USUARIO
// ======================
const getAllPayments = async () => {
    const [payments] = await db.query(`
        SELECT 
            p.Num_payment,
            p.Num_order,
            p.Payment_method,
            p.Payment_status,
            p.Transaction_id,
            p.created_at,
            o.Total as order_total,
            o.Status as order_status,
            CONCAT(u.Firs_name_user, ' ', u.Last_name_user) as user_name,
            u.Email as user_email,
            u.Num_user
        FROM payments p
        JOIN orders o ON p.Num_order = o.Num_order
        JOIN users u ON o.Num_user = u.Num_user
        ORDER BY p.created_at DESC
    `);
    
    return payments;
};

// ======================
// OBTENER PAGOS POR ORDEN
// ======================
const getPaymentsByOrder = async (Num_order) => {
    const [payments] = await db.query(`
        SELECT 
            p.Num_payment,
            p.Num_order,
            p.Payment_method,
            p.Payment_status,
            p.Transaction_id,
            p.created_at,
            o.Total as order_total,
            o.Status as order_status,
            CONCAT(u.Firs_name_user, ' ', u.Last_name_user) as user_name,
            u.Email as user_email,
            u.Num_user
        FROM payments p
        JOIN orders o ON p.Num_order = o.Num_order
        JOIN users u ON o.Num_user = u.Num_user
        WHERE p.Num_order = ?
        ORDER BY p.created_at DESC
    `, [Num_order]);
    
    return payments;
};

// ======================
// OBTENER PAGOS POR USUARIO
// ======================
const getPaymentsByUser = async (Num_user) => {
    const [payments] = await db.query(`
        SELECT 
            p.Num_payment,
            p.Num_order,
            p.Payment_method,
            p.Payment_status,
            p.Transaction_id,
            p.created_at,
            o.Total as order_total,
            o.Status as order_status,
            CONCAT(u.Firs_name_user, ' ', u.Last_name_user) as user_name,
            u.Email as user_email,
            u.Num_user
        FROM payments p
        JOIN orders o ON p.Num_order = o.Num_order
        JOIN users u ON o.Num_user = u.Num_user
        WHERE o.Num_user = ?
        ORDER BY p.created_at DESC
    `, [Num_user]);
    
    return payments;
};

module.exports = {
    createPayment,
    getAllPayments,
    getPaymentsByOrder,
    getPaymentsByUser
};