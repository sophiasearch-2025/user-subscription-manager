// Servicio de notificaciones - Envía notificaciones individuales por email
const admin = require('firebase-admin');
const emailService = require('./email.service');

/**
 * Envía email de bienvenida a un usuario
 * @param {string} userId - ID del usuario
 * @param {Object} userData - Datos del usuario (email, name)
 */
async function sendWelcomeNotification(userId, userData) {
  try {
    if (!userData.email) {
      console.warn(`⚠️ Usuario ${userId} no tiene email`);
      return null;
    }

    console.log(`📧 Enviando email de bienvenida a: ${userData.email}`);
    
    const result = await emailService.sendWelcomeEmail(userData.email, {
      userName: userData.name || userData.email.split('@')[0]
    });

    // Registrar la notificación en Firebase
    const db = admin.firestore();
    await db.collection('notifications').add({
      type: 'WELCOME',
      userId: userId,
      email: userData.email,
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'sent'
    });

    console.log(`✅ Email de bienvenida enviado a ${userData.email}`);
    return result;
  } catch (error) {
    console.error(`❌ Error enviando bienvenida a ${userData.email}:`, error.message);
    
    // Registrar error
    const db = admin.firestore();
    await db.collection('notifications').add({
      type: 'WELCOME',
      userId: userId,
      email: userData.email,
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'failed',
      error: error.message
    });
    
    throw error;
  }
}

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
    const db = admin.firestore();
    await db.collection('notifications').add({
      type: 'SUBSCRIPTION_RECEIVED',
      userId: data.userId || null,
      email: data.userEmail,
      subscriptionId: data.subscriptionId,
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'sent'
    });
    
    console.log('✅ Notificación de suscripción enviada:', data.userEmail);
    return true;
  } catch (error) {
    console.error('❌ Error enviando notificación de suscripción:', error);
    
    // Registrar error en Firebase
    const db = admin.firestore();
    await db.collection('notifications').add({
      type: 'SUBSCRIPTION_RECEIVED',
      email: data.userEmail,
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
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
    const db = admin.firestore();
    await db.collection('notifications').add({
      type: 'PLAN_EXPIRING',
      userId: data.userId || null,
      email: data.userEmail,
      daysRemaining: data.daysRemaining,
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'sent'
    });
    
    console.log('✅ Notificación de expiración enviada:', data.userEmail);
    return true;
  } catch (error) {
    console.error('❌ Error enviando notificación de expiración:', error);
    
    const db = admin.firestore();
    await db.collection('notifications').add({
      type: 'PLAN_EXPIRING',
      email: data.userEmail,
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
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
    const db = admin.firestore();
    await db.collection('notifications').add({
      type: 'PLAN_RENEWED',
      userId: data.userId || null,
      email: data.userEmail,
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'sent'
    });
    
    console.log('✅ Notificación de renovación enviada:', data.userEmail);
    return true;
  } catch (error) {
    console.error('❌ Error enviando notificación de renovación:', error);
    
    const db = admin.firestore();
    await db.collection('notifications').add({
      type: 'PLAN_RENEWED',
      email: data.userEmail,
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'failed',
      error: error.message
    });
    
    throw error;
  }
}

module.exports = {
  sendWelcomeNotification,
  sendSubscriptionReceivedNotification,
  sendPlanExpirationNotification,
  sendPlanRenewalNotification
};

