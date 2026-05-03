// modules/orders/order.controller.js
const orderService = require('./order.service');

const checkout = async (req, res) => {
    try {
        const num_user = req.headers['x-user-id'];

        if (!num_user) {
            return res.status(400).json({
                success: false,
                message: "Se requiere el header 'x-user-id'"
            });
        }

        const result = await orderService.checkout(num_user);

        res.status(201).json({
            success: true,
            message: "Orden creada correctamente",
            order: result
        });
    } catch (error) {
        console.error('Error en checkout:', error);
        res.status(500).json({
            success: false,
            message: error.message || "Error al procesar el checkout",
            error: error.message
        });
    }
};

// Obtener órdenes del usuario
const getUserOrders = async (req, res) => {
    try {
        const num_user = req.headers['x-user-id'];

        if (!num_user) {
            return res.status(400).json({
                success: false,
                message: "Se requiere el header 'x-user-id'"
            });
        }

        const orders = await orderService.getUserOrders(num_user);

        res.status(200).json({
            success: true,
            count: orders.length,
            orders: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener órdenes",
            error: error.message
        });
    }
};// ======================
// OBTENER DETALLE DE UNA ORDEN (por Header)
// ======================
const getOrderDetail = async (req, res) => {
    try {
        // Forma más segura
        const num_order = req.header('x-order-id') || 
                         req.headers['x-order-id'] || 
                         req.headers['X-Order-Id'];

        if (!num_order) {
            return res.status(400).json({
                success: false,
                message: "Se requiere el header 'x-order-id'"
            });
        }

        const data = await orderService.getOrderDetail(num_order);

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Orden no encontrada"
            });
        }

        res.status(200).json({
            success: true,
            data: data
        });
    } catch (error) {
        console.error('Error en getOrderDetail:', error);
        res.status(500).json({
            success: false,
            message: "Error al obtener detalle de orden",
            error: error.message
        });
    }
};
// Actualizar estado (Admin)
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Se requiere el estado"
            });
        }

        const result = await orderService.updateOrderStatus(id, status);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Orden no encontrada"
            });
        }

        res.status(200).json({
            success: true,
            message: "Estado de orden actualizado"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar estado",
            error: error.message
        });
    }
};

module.exports = {
    checkout,
    getUserOrders,
    getOrderDetail,
    updateOrderStatus
};