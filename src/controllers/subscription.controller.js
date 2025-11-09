// Controlador de suscripciones
const { db } = require('../config/firebase');
const notificationService = require('../services/notification.service');

/**
 * Crear una nueva solicitud de suscripción
 */
async function createSubscription(req, res) {
  try {
    const { userId, planId, userEmail, userName, planName } = req.body;
    
    // TODO: Validar datos
    // TODO: Guardar en Firebase
    
    const subscriptionId = `sub_${Date.now()}`; // Temporal, debe venir de Firebase
    
    // Enviar notificación de suscripción recibida
    await notificationService.sendSubscriptionReceivedNotification({
      userEmail,
      userName,
      planName,
      subscriptionId
    });
    
    res.status(201).json({
      success: true,
      message: 'Suscripción creada y notificación enviada',
      data: { subscriptionId }
    });
    
  } catch (error) {
    console.error('Error creando suscripción:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear suscripción',
      error: error.message
    });
  }
}

/**
 * Renovar una suscripción existente
 */
async function renewSubscription(req, res) {
  try {
    const { subscriptionId } = req.params;
    const { userEmail, userName, planName } = req.body;
    
    // TODO: Buscar suscripción en Firebase
    // TODO: Actualizar fecha de vencimiento
    
    const newExpirationDate = new Date();
    newExpirationDate.setMonth(newExpirationDate.getMonth() + 1);
    
    // Enviar notificación de renovación
    await notificationService.sendPlanRenewalNotification({
      userEmail,
      userName,
      planName,
      newExpirationDate: newExpirationDate.toISOString()
    });
    
    res.json({
      success: true,
      message: 'Suscripción renovada y notificación enviada',
      data: { newExpirationDate }
    });
    
  } catch (error) {
    console.error('Error renovando suscripción:', error);
    res.status(500).json({
      success: false,
      message: 'Error al renovar suscripción',
      error: error.message
    });
  }
}

/**
 * Verificar suscripciones próximas a vencer
 * Este método debería ser llamado por un cron job diario
 */
async function checkExpiringSubscriptions(req, res) {
  try {
    // TODO: Obtener todas las suscripciones activas de Firebase
    // TODO: Filtrar las que vencen en 7, 3 o 1 día
    
    // Ejemplo de cómo enviar notificación
    const subscriptionsExpiringSoon = [
      // TODO: Esto vendría de Firebase
      {
        userEmail: 'usuario@example.com',
        userName: 'Usuario Ejemplo',
        planName: 'Plan Premium',
        expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        daysRemaining: 7
      }
    ];
    
    for (const subscription of subscriptionsExpiringSoon) {
      await notificationService.sendPlanExpirationNotification(subscription);
    }
    
    res.json({
      success: true,
      message: `Se enviaron ${subscriptionsExpiringSoon.length} notificaciones`,
      count: subscriptionsExpiringSoon.length
    });
    
  } catch (error) {
    console.error('Error verificando suscripciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error al verificar suscripciones',
      error: error.message
    });
  }
}

/**
 * Obtener todas las suscripciones
 */
async function getAllSubscriptions(req, res) {
  try {
    const subscriptionsRef = db.collection('subscriptions');
    const snapshot = await subscriptionsRef.get();
    
    const subscriptions = [];
    snapshot.forEach(doc => {
      subscriptions.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json({
      success: true,
      data: subscriptions
    });
  } catch (error) {
    console.error('Error obteniendo suscripciones:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

/**
 * Obtener una suscripción por ID
 */
async function getSubscriptionById(req, res) {
  try {
    const { id } = req.params;
    const docRef = db.collection('subscriptions').doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Suscripción no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: {
        id: doc.id,
        ...doc.data()
      }
    });
  } catch (error) {
    console.error('Error obteniendo suscripción:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

/**
 * Cancelar una suscripción
 */
async function cancelSubscription(req, res) {
  try {
    const { id } = req.params;
    // TODO: Actualizar en Firebase
    res.json({
      success: true,
      message: 'Suscripción cancelada'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

module.exports = {
  createSubscription,
  renewSubscription,
  checkExpiringSubscriptions,
  getAllSubscriptions,
  getSubscriptionById,
  cancelSubscription
};

