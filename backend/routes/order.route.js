const express = require('express');
const router = express.Router();

// ✅ MIDDLEWARES PARA VERIFICAR TOKEN Y ROL DE ADMIN
const { verifyToken, verifyAdmin } = require('../middlewares/verifyToken');

// ✅ CONTROLADORES DE LAS ÓRDENES
const orderController = require('../controllers/order.controller');

// ✅ [POST] CREAR UNA ORDEN - REQUIERE USUARIO AUTENTICADO
router.post('/', verifyToken, orderController.createOrder);

// ✅ [GET] OBTENER ORDEN POR ID - REQUIERE USUARIO AUTENTICADO
router.get('/:id', verifyToken, orderController.getOrderById);

// ✅ [GET] OBTENER TODAS LAS ÓRDENES - SOLO ADMINISTRADOR
router.get('/', verifyToken, verifyAdmin, orderController.getAllOrders);

// ✅ [DELETE] ELIMINAR UNA ORDEN POR ID - SOLO ADMINISTRADOR
router.delete('/:id', verifyToken, verifyAdmin, orderController.deleteOrder);

// ✅ [PUT] ACTUALIZAR ESTADO DE UNA ORDEN POR ID - SOLO ADMINISTRADOR
router.put('/:id', verifyToken, verifyAdmin, orderController.updateOrderStatus);

// ✅ EXPORTAMOS LAS RUTAS PARA USO EN LA APP PRINCIPAL
module.exports = router;
