const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middlewares/verifyToken');
const userController = require('../controllers/user.controller');

router.put('/:id', verifyToken, userController.updateUser);
router.delete('/:id', verifyToken, userController.deleteUser);
router.get('/:id', verifyToken, userController.getUserById);
router.get('/', verifyToken, verifyAdmin, userController.getAllUsers);

module.exports = router;