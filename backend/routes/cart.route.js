const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/verifyToken');
const cartController = require('../controllers/cart.controller');

// RUTA PARA OBTENER EL CARRITO DEL USUARIO AUTENTICADO
router.get('/', verifyToken, cartController.getCartByUser);

// RUTA PARA AGREGAR UN PRODUCTO AL CARRITO
router.post('/add', verifyToken, cartController.addProductToCart);

// RUTA PARA ELIMINAR UN PRODUCTO DEL CARRITO (por productoId)
router.delete('/remove/:productoId', verifyToken, cartController.removeProductFromCart);

// RUTA PARA VACIAR COMPLETAMENTE EL CARRITO
router.delete('/clear', verifyToken, cartController.clearCart);

module.exports = router;
