// Rutas de gestión de usuarios
const express = require('express');
const router = express.Router();
const multer = require('multer');
const userController = require('../controllers/user.controller');

// Configurar Multer para manejar archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB máximo
  },
  fileFilter: (req, file, cb) => {
    // Validar tipo de archivo
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes (JPG, PNG, WEBP)'));
    }
  }
});

// Crear nuevo usuario con comprobante (solicitud pendiente)
router.post('/', upload.single('comprobante'), userController.createUser);

// Obtener todos los usuarios
router.get('/', userController.getAllUsers);

// Obtener usuarios con solicitudes pendientes (Admin)
router.get('/pending', userController.getPendingUsers);

// Obtener usuario por ID
router.get('/:id', userController.getUserById);

// Obtener comprobante de un usuario (Admin)
router.get('/:uid/comprobante', userController.getComprobante);

// Aprobar solicitud de usuario (Admin)
router.patch('/:uid/approve', userController.approveUser);

// Rechazar solicitud de usuario (Admin)
router.patch('/:uid/reject', userController.rejectUser);

module.exports = router;
