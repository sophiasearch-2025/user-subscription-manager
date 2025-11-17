// Rutas de gestión de planes de suscripción
const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscription.controller');

// Crear nueva suscripción
router.post('/', subscriptionController.createSubscription);

// Obtener todas las suscripciones
router.get('/', subscriptionController.getAllSubscriptions);

// Obtener suscripción por ID
router.get('/:id', subscriptionController.getSubscriptionById);

// Actualizar suscripción (PATCH - RESTful)
router.patch('/:id', subscriptionController.updateSubscription);

// Renovar suscripción (deprecated - usar PATCH en su lugar)
router.post('/:id/renew', subscriptionController.renewSubscription);

// Cancelar suscripción
router.delete('/:id', subscriptionController.cancelSubscription);

// Verificar suscripciones próximas a vencer (para cron job)
router.post('/check-expiring', subscriptionController.checkExpiringSubscriptions);

module.exports = router;

