// modules/cart/cart.controller.js
const cartService = require('./cart.service');

// ======================
// CREAR CARRITO SI NO EXISTE
// ======================
const createCart = async (req, res) => {
    try {
        const num_user = req.headers['x-user-id'];

        if (!num_user) {
            return res.status(400).json({
                success: false,
                message: "Se requiere el header 'x-user-id'"
            });
        }

        const cartId = await cartService.createCartIfNotExists(num_user);

        res.status(200).json({
            success: true,
            message: "Carrito listo",
            Num_cart: cartId
        });
    } catch (error) {
        console.error('Error en createCart:', error);
        res.status(500).json({
            success: false,
            message: "Error al crear/obtener el carrito",
            error: error.message
        });
    }
};

// ======================
// OBTENER CARRITO DEL USUARIO
// ======================
const getCart = async (req, res) => {
    try {
        const num_user = req.headers['x-user-id'];

        if (!num_user) {
            return res.status(400).json({
                success: false,
                message: "Se requiere el header 'x-user-id'"
            });
        }

        const cart = await cartService.getCartByUser(num_user);

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "El usuario no tiene carrito"
            });
        }

        res.status(200).json({
            success: true,
            data: cart
        });
    } catch (error) {
        console.error('Error en getCart:', error);
        res.status(500).json({
            success: false,
            message: "Error al obtener el carrito",
            error: error.message
        });
    }
};

//controllers de carts items

// ======================
// AGREGAR ITEM AL CARRITO
// ======================
const addItem = async (req, res) => {
    try {
        const num_user = req.headers['x-user-id'];
        const { num_product, quantity = 1 } = req.body;

        if (!num_user) {
            return res.status(400).json({
                success: false,
                message: "Se requiere el header 'x-user-id'"
            });
        }

        if (!num_product) {
            return res.status(400).json({
                success: false,
                message: "Se requiere num_product"
            });
        }

        const num_cart = await cartService.createCartIfNotExists(num_user);
        const result = await cartService.addItemToCart(num_cart, num_product, quantity);

        res.status(200).json({
            success: true,
            message: "Producto agregado/actualizado en el carrito",
            ...result
        });
    } catch (error) {
        console.error('Error en addItem:', error);
        res.status(500).json({
            success: false,
            message: "Error al agregar item al carrito",
            error: error.message
        });
    }
};

// ======================
// OBTENER ITEMS DEL CARRITO
// ======================
const getCartItems = async (req, res) => {
    try {
        const num_user = req.headers['x-user-id'];

        if (!num_user) {
            return res.status(400).json({
                success: false,
                message: "Se requiere el header 'x-user-id'"
            });
        }

        const cart = await cartService.getCartByUser(num_user);

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "El usuario no tiene carrito"
            });
        }

        const items = await cartService.getCartItems(cart.Num_cart);

        res.status(200).json({
            success: true,
            Num_cart: cart.Num_cart,
            items_count: items.length,
            items: items
        });
    } catch (error) {
        console.error('Error en getCartItems:', error);
        res.status(500).json({
            success: false,
            message: "Error al obtener los items del carrito",
            error: error.message
        });
    }
};

// ======================
// ACTUALIZAR CANTIDAD DE UN ITEM
// ======================
const updateItemQuantity = async (req, res) => {
    try {
        const { num_cart_item, quantity } = req.body;
        

        if (!num_cart_item || quantity === undefined) {
            return res.status(400).json({
                success: false,
                message: "Se requiere num_cart_item y quantity"
            });
        }

        await cartService.updateCartItemQuantity(num_cart_item, quantity);

        res.status(200).json({
            success: true,
            message: "Cantidad actualizada correctamente"
        });
    } catch (error) {
        console.error('Error en updateItemQuantity:', error);
        res.status(500).json({
            success: false,
            message: "Error al actualizar cantidad",
            error: error.message
        });
    }
};

// ======================
// ELIMINAR UN ITEM DEL CARRITO
// ======================
const removeItem = async (req, res) => {
    try {
        const { num_cart_item } = req.body;

        if (!num_cart_item) {
            return res.status(400).json({
                success: false,
                message: "Se requiere num_cart_item"
            });
        }

        await cartService.removeCartItem(num_cart_item);

        res.status(200).json({
            success: true,
            message: "Item eliminado del carrito correctamente"
        });
    } catch (error) {
        console.error('Error en removeItem:', error);
        res.status(500).json({
            success: false,
            message: "Error al eliminar item",
            error: error.message
        });
    }
};
// ======================
// VACIAR TODO EL CARRITO
// ======================
const clearCart = async (req, res) => {
    try {
        const num_user = req.headers['x-user-id'];

        if (!num_user) {
            return res.status(400).json({
                success: false,
                message: "Se requiere el header 'x-user-id'"
            });
        }

        const cart = await cartService.getCartByUser(num_user);

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "El usuario no tiene carrito"
            });
        }

        await cartService.clearCart(cart.Num_cart);

        res.status(200).json({
            success: true,
            message: "Carrito vaciado correctamente"
        });
    } catch (error) {
        console.error('Error en clearCart:', error);
        res.status(500).json({
            success: false,
            message: "Error al vaciar el carrito",
            error: error.message
        });
    }
};

module.exports = {
    createCart,
    getCart,
    getCartItems,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart
};