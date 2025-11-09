// Rutas de pagos
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

// GET /api/payments - Obtener todos los pagos
router.get('/', paymentController.getAllPayments);

// GET /api/payments/:id - Obtener un pago específico
router.get('/:id', paymentController.getPaymentById);

// GET /api/payments/user/:userId - Obtener pagos de un usuario
router.get('/user/:userId', paymentController.getPaymentsByUser);

module.exports = router;
