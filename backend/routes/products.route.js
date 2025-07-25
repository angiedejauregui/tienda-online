const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products.controller');

router.post('/', productsController.createProduct);
router.put('/:id', productsController.updateProduct);
router.delete('/:id', productsController.deleteProduct);
router.get('/:id', productsController.getProductById);
router.get('/', productsController.getAllProducts);

module.exports = router;