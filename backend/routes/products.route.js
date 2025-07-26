const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middlewares/verifyToken');
const productsController = require('../controllers/products.controller');

router.post('/', verifyToken, verifyAdmin, productsController.createProduct);
router.put('/:id', verifyToken, verifyAdmin, productsController.updateProduct);
router.delete('/:id', verifyToken, verifyAdmin, productsController.deleteProduct);
router.get('/:id', productsController.getProductById);
router.get('/', productsController.getAllProducts);

module.exports = router;