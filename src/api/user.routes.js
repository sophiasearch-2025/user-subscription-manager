// Rutas de gestión de usuarios
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Crear nuevo usuario
router.post('/', userController.createUser);

// Obtener todos los usuarios
router.get('/', userController.getAllUsers);

// Obtener usuario por ID
router.get('/:id', userController.getUserById);

module.exports = router;
