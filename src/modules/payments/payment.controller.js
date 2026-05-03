// modules/payments/payment.controller.js
const paymentService = require('./payment.service');

// ======================
// CREAR PAGO
// ======================
const createPayment = async (req, res) => {
    try {
        const result = await paymentService.createPayment(req.body);

        res.status(201).json({
            success: true,
            message: "Pago creado correctamente",
            payment: result
        });
    } catch (error) {
        console.error('Error en createPayment:', error);
        res.status(500).json({
            success: false,
            message: "Error al crear el pago",
            error: error.message
        });
    }
};

// ======================
// OBTENER TODOS LOS PAGOS
// ======================
const getAllPayments = async (req, res) => {
    try {
        const payments = await paymentService.getAllPayments();

        res.status(200).json({
            success: true,
            count: payments.length,
            payments: payments
        });
    } catch (error) {
        console.error('Error en getAllPayments:', error);
        res.status(500).json({
            success: false,
            message: "Error al obtener los pagos",
            error: error.message
        });
    }
};

// ======================
// OBTENER PAGOS POR ORDEN
// ======================
const getPaymentsByOrder = async (req, res) => {
    try {
        const num_order = req.headers['x-order-id'];

        if (!num_order) {
            return res.status(400).json({
                success: false,
                message: "Se requiere el header 'x-order-id'"
            });
        }

        const payments = await paymentService.getPaymentsByOrder(num_order);

        res.status(200).json({
            success: true,
            count: payments.length,
            payments: payments
        });
    } catch (error) {
        console.error('Error en getPaymentsByOrder:', error);
        res.status(500).json({
            success: false,
            message: "Error al obtener los pagos de la orden",
            error: error.message
        });
    }
};

// ======================
// OBTENER PAGOS POR USUARIO
// ======================
const getPaymentsByUser = async (req, res) => {
    try {
        const num_user = req.headers['x-user-id'];

        if (!num_user) {
            return res.status(400).json({
                success: false,
                message: "Se requiere el header 'x-user-id'"
            });
        }

        const payments = await paymentService.getPaymentsByUser(num_user);

        res.status(200).json({
            success: true,
            count: payments.length,
            payments: payments
        });
    } catch (error) {
        console.error('Error en getPaymentsByUser:', error);
        res.status(500).json({
            success: false,
            message: "Error al obtener los pagos del usuario",
            error: error.message
        });
    }
};

module.exports = {
    createPayment,
    getAllPayments,
    getPaymentsByOrder,
    getPaymentsByUser
};