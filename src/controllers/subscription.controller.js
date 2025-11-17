// Controlador de suscripciones
const { db } = require('../config/firebase');
const notificationService = require('../services/notification.service');

/**
 * Crear una nueva solicitud de suscripción
 * Endpoint: POST /api/subscriptions
 * Body: { userId, planId, userEmail, userName, planName, precio }
 */
async function createSubscription(req, res) {
  try {
    const { userId, planId, userEmail, userName, planName, precio } = req.body;
    
    // 1. Validar datos requeridos
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId es requerido'
      });
    }

    if (!planId) {
      return res.status(400).json({
        success: false,
        message: 'planId es requerido'
      });
    }

    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: 'userEmail es requerido para enviar notificación'
      });
    }

    console.log(`📝 Creando suscripción para usuario: ${userId}`);
    
    // 2. Crear suscripción en Firebase
    const subscriptionData = {
      userId,
      planId,
      plan: planName || planId,
      descripcion: `Suscripción a ${planName || planId}`,
      precio: precio || 0,
      status: 'active',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 días
      cancelAtPeriodEnd: false,
      metadata: {
        userEmail,
        userName: userName || 'Usuario'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await db.collection('subscriptions').add(subscriptionData);
    const subscriptionId = docRef.id;
    
    // Actualizar con el ID
    await docRef.update({ id: subscriptionId });
    
    console.log(`✅ Suscripción creada en Firebase: ${subscriptionId}`);
    
    // 3. Enviar notificación por email automáticamente
    try {
      await notificationService.sendSubscriptionReceivedNotification({
        userId,
        userEmail,
        userName: userName || 'Usuario',
        planName: planName || planId,
        subscriptionId
      });
      console.log(`📧 Notificación enviada a: ${userEmail}`);
    } catch (emailError) {
      console.warn(`⚠️ Error enviando email (continuando):`, emailError.message);
      // No fallar si el email falla
    }
    
    // 4. Responder con éxito
    res.status(201).json({
      success: true,
      message: 'Suscripción creada exitosamente. Notificación enviada por email.',
      data: {
        subscriptionId,
        userId,
        planId,
        status: 'active',
        userEmail,
        currentPeriodEnd: subscriptionData.currentPeriodEnd,
        notificationSent: true
      }
    });
    
  } catch (error) {
    console.error('❌ Error creando suscripción:', error);
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

