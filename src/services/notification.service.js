// Servicio de notificaciones - Envía notificaciones por email usando Firebase
const emailService = require('./email.service');
const { db } = require('../config/firebase');

/**
 * Envía notificación de suscripción recibida
 * @param {Object} data - { userEmail, userName, planName, subscriptionId }
 */
async function sendSubscriptionReceivedNotification(data) {
  try {
    console.log('📧 Enviando notificación de suscripción recibida...');
    
    await emailService.sendSubscriptionReceivedEmail(data.userEmail, {
      userName: data.userName,
      planName: data.planName,
      subscriptionId: data.subscriptionId
    });
    
    // Registrar la notificación en Firebase (opcional, para auditoría)
    await db.collection('notifications').add({
      type: 'SUBSCRIPTION_RECEIVED',
      userId: data.userId || null,
      email: data.userEmail,
      subscriptionId: data.subscriptionId,
      sentAt: new Date().toISOString(),
      status: 'sent'
    });
    
    console.log('✅ Notificación de suscripción enviada:', data.userEmail);
    return true;
  } catch (error) {
    console.error('❌ Error enviando notificación de suscripción:', error);
    
    // Registrar error en Firebase
    await db.collection('notifications').add({
      type: 'SUBSCRIPTION_RECEIVED',
      email: data.userEmail,
      sentAt: new Date().toISOString(),
      status: 'failed',
      error: error.message
    });
    
    throw error;
  }
}


/**
 * Envía notificación de plan próximo a vencer
 * @param {Object} data - { userEmail, userName, planName, expirationDate, daysRemaining }
 */
async function sendPlanExpirationNotification(data) {
  try {
    console.log('⏰ Enviando notificación de plan próximo a vencer...');
    
    await emailService.sendPlanExpiringEmail(data.userEmail, {
      userName: data.userName,
      planName: data.planName,
      expirationDate: data.expirationDate,
      daysRemaining: data.daysRemaining
    });
    
    // Registrar la notificación en Firebase
    await db.collection('notifications').add({
      type: 'PLAN_EXPIRING',
      userId: data.userId || null,
      email: data.userEmail,
      daysRemaining: data.daysRemaining,
      sentAt: new Date().toISOString(),
      status: 'sent'
    });
    
    console.log('✅ Notificación de expiración enviada:', data.userEmail);
    return true;
  } catch (error) {
    console.error('❌ Error enviando notificación de expiración:', error);
    
    await db.collection('notifications').add({
      type: 'PLAN_EXPIRING',
      email: data.userEmail,
      sentAt: new Date().toISOString(),
      status: 'failed',
      error: error.message
    });
    
    throw error;
  }
}

/**
 * Envía notificación de renovación de plan
 * @param {Object} data - { userEmail, userName, planName, newExpirationDate }
 */
async function sendPlanRenewalNotification(data) {
  try {
    console.log('🔄 Enviando notificación de renovación de plan...');
    
    await emailService.sendPlanRenewedEmail(data.userEmail, {
      userName: data.userName,
      planName: data.planName,
      newExpirationDate: data.newExpirationDate
    });
    
    // Registrar la notificación en Firebase
    await db.collection('notifications').add({
      type: 'PLAN_RENEWED',
      userId: data.userId || null,
      email: data.userEmail,
      sentAt: new Date().toISOString(),
      status: 'sent'
    });
    
    console.log('✅ Notificación de renovación enviada:', data.userEmail);
    return true;
  } catch (error) {
    console.error('❌ Error enviando notificación de renovación:', error);
    
    await db.collection('notifications').add({
      type: 'PLAN_RENEWED',
      email: data.userEmail,
      sentAt: new Date().toISOString(),
      status: 'failed',
      error: error.message
    });
    
    throw error;
  }
}

module.exports = {
  sendSubscriptionReceivedNotification,
  sendPlanExpirationNotification,
  sendPlanRenewalNotification
};

