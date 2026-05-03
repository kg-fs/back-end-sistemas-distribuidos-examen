// modules/pickup/pickup.controller.js
const pickupService = require('./pickup.service');

// ======================
// CREAR PICKUP/ENTREGA
// ======================
const createPickup = async (req, res) => {
    try {
        const result = await pickupService.createPickup(req.body);

        res.status(201).json({
            success: true,
            message: "Pickup/entrega creado correctamente",
            pickup: result
        });
    } catch (error) {
        console.error('Error en createPickup:', error);
        res.status(500).json({
            success: false,
            message: "Error al crear el pickup",
            error: error.message
        });
    }
};

// ======================
// OBTENER TODOS LOS PICKUPS
// ======================
const getAllPickups = async (req, res) => {
    try {
        const pickups = await pickupService.getAllPickups();

        res.status(200).json({
            success: true,
            count: pickups.length,
            pickups: pickups
        });
    } catch (error) {
        console.error('Error en getAllPickups:', error);
        res.status(500).json({
            success: false,
            message: "Error al obtener los pickups",
            error: error.message
        });
    }
};

// ======================
// OBTENER PICKUPS POR ORDEN
// ======================
const getPickupsByOrder = async (req, res) => {
    try {
        const num_order = req.headers['x-order-id'];

        if (!num_order) {
            return res.status(400).json({
                success: false,
                message: "Se requiere el header 'x-order-id'"
            });
        }

        const pickups = await pickupService.getPickupsByOrder(num_order);

        res.status(200).json({
            success: true,
            count: pickups.length,
            pickups: pickups
        });
    } catch (error) {
        console.error('Error en getPickupsByOrder:', error);
        res.status(500).json({
            success: false,
            message: "Error al obtener los pickups de la orden",
            error: error.message
        });
    }
};

// ======================
// OBTENER PICKUPS POR USUARIO
// ======================
const getPickupsByUser = async (req, res) => {
    try {
        const num_user = req.headers['x-user-id'];

        if (!num_user) {
            return res.status(400).json({
                success: false,
                message: "Se requiere el header 'x-user-id'"
            });
        }

        const pickups = await pickupService.getPickupsByUser(num_user);

        res.status(200).json({
            success: true,
            count: pickups.length,
            pickups: pickups
        });
    } catch (error) {
        console.error('Error en getPickupsByUser:', error);
        res.status(500).json({
            success: false,
            message: "Error al obtener los pickups del usuario",
            error: error.message
        });
    }
};

// ======================
// OBTENER PICKUPS POR ESTADO
// ======================
const getPickupsByStatus = async (req, res) => {
    try {
        const status = req.headers['x-status'];

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Se requiere el header 'x-status'"
            });
        }

        const pickups = await pickupService.getPickupsByStatus(status);

        res.status(200).json({
            success: true,
            count: pickups.length,
            pickups: pickups
        });
    } catch (error) {
        console.error('Error en getPickupsByStatus:', error);
        res.status(500).json({
            success: false,
            message: "Error al obtener los pickups por estado",
            error: error.message
        });
    }
};

module.exports = {
    createPickup,
    getAllPickups,
    getPickupsByOrder,
    getPickupsByUser,
    getPickupsByStatus
};