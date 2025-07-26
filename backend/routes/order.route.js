const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middlewares/verifyToken');
const orderController = require('../controllers/order.controller');

router.post('/', verifyToken, orderController.createOrder);
router.get('/:id', verifyToken, orderController.getOrderById);  
router.get('/', verifyToken, verifyAdmin, orderController.getAllOrders);
router.delete('/:id', verifyToken, verifyAdmin, orderController.deleteOrder);
router.put('/:id', verifyToken, verifyAdmin, orderController.updateOrderStatus);

module.exports = router;