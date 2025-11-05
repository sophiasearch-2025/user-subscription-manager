const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Crear usuario
router.post('/', userController.createUser);

// Listar usuarios
router.get('/', userController.listUsers);

// Obtener usuario por UID
router.get('/:uid', userController.getUserByUid);

// Actualizar usuario
router.put('/:uid', userController.updateUser);

// Eliminar usuario
router.delete('/:uid', userController.deleteUser);

module.exports = router;
// TODO: Implementar rutas de CRUD de usuarios y perfiles
