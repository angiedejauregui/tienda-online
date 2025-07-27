const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middlewares/verifyToken');
const userController = require('../controllers/user.controller');

// SOLO ADMIN PUEDE LISTAR TODOS LOS USUARIOS
router.get('/', verifyToken, verifyAdmin, userController.getAllUsers);

// CUALQUIER USUARIO AUTENTICADO PUEDE VER SU PROPIO PERFIL (O EL DE OTROS)
// SI QUIERES RESTRINGIRLO SOLO A SU PROPIO ID, DEBES AGREGAR LÓGICA EXTRA EN EL CONTROLADOR
router.get('/:id', verifyToken, userController.getUserById);

// SOLO ADMIN PUEDE ACTUALIZAR USUARIOS
router.put('/:id', verifyToken, verifyAdmin, userController.updateUser);

// SOLO ADMIN PUEDE ELIMINAR USUARIOS
router.delete('/:id', verifyToken, verifyAdmin, userController.deleteUser);

module.exports = router;
