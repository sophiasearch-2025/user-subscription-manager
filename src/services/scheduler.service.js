// Servicio para verificación periódica de suscripciones
const admin = require('firebase-admin');
const emailService = require('./email.service');

/**
 * Verifica todas las suscripciones activas y envía notificaciones
 * para las que están próximas a vencer
 * 
 * Se envían notificaciones en:
 * - 7 días antes del vencimiento
 * - 5 días antes del vencimiento
 * - 3 días antes del vencimiento
 * - 1 día antes del vencimiento
 */
async function checkExpiringSubscriptions() {
  try {
    console.log('🔍 Iniciando verificación de suscripciones...');
    
    const db = admin.firestore();
    const now = new Date();
    const notificationDays = [7, 5, 3, 1]; // Días antes del vencimiento para notificar
    
    // Obtener todas las suscripciones activas
    const subscriptionsRef = db.collection('subscriptions');
    const snapshot = await subscriptionsRef
      .where('status', '==', 'active')
      .get();
    
    if (snapshot.empty) {
      console.log('ℹ️ No hay suscripciones activas para verificar');
      return { checked: 0, notificationsSent: 0 };
    }
    
    let notificationsSent = 0;
    const subscriptionsToNotify = [];
    
    // Revisar cada suscripción
    snapshot.forEach(doc => {
      const subscription = doc.data();
      const expirationDate = subscription.endDate?.toDate ? subscription.endDate.toDate() : new Date(subscription.endDate);
      const daysUntilExpiration = Math.ceil((expirationDate - now) / (1000 * 60 * 60 * 24));
      
      // Verificar si necesita notificación
      if (notificationDays.includes(daysUntilExpiration)) {
        // Verificar si ya se envió notificación hoy para este día específico
        const notificationKey = `expiring_${daysUntilExpiration}d`;
        const lastNotification = subscription.lastNotifications?.[notificationKey];
        
        const today = new Date().toISOString().split('T')[0];
        const lastNotificationDate = lastNotification?.toDate ? 
          lastNotification.toDate().toISOString().split('T')[0] : 
          lastNotification?.split('T')[0];
        
        // Solo enviar si no se ha enviado notificación hoy para este día específico
        if (!lastNotificationDate || lastNotificationDate !== today) {
          subscriptionsToNotify.push({
            id: doc.id,
            ...subscription,
            daysRemaining: daysUntilExpiration,
            expirationDate: expirationDate
          });
        }
      }
    });
    
    // Enviar notificaciones
    for (const subscription of subscriptionsToNotify) {
      try {
        // Obtener datos del usuario
        const userDoc = await db.collection('users').doc(subscription.userId).get();
        const user = userDoc.data();
        
        if (!user || !user.email) {
          console.warn(`⚠️ Usuario no encontrado o sin email: ${subscription.userId}`);
          continue;
        }
        
        // Enviar email
        await emailService.sendPlanExpiringEmail(user.email, {
          userName: user.name || user.email,
          planName: subscription.planName || subscription.planId || 'Plan Premium',
          expirationDate: subscription.expirationDate,
          daysRemaining: subscription.daysRemaining
        });
        
        // Actualizar marca de notificación enviada para este día específico
        const notificationKey = `expiring_${subscription.daysRemaining}d`;
        await db.collection('subscriptions').doc(subscription.id).update({
          [`lastNotifications.${notificationKey}`]: admin.firestore.FieldValue.serverTimestamp()
        });
        
        // Registrar en colección de notificaciones
        await db.collection('notifications').add({
          type: 'PLAN_EXPIRING',
          userId: subscription.userId,
          email: user.email,
          subscriptionId: subscription.id,
          daysRemaining: subscription.daysRemaining,
          sentAt: admin.firestore.FieldValue.serverTimestamp(),
          status: 'sent'
        });
        
        notificationsSent++;
        console.log(`✅ Notificación enviada a ${user.email} (${subscription.daysRemaining} días)`);
        
      } catch (error) {
        console.error(`❌ Error enviando notificación para suscripción ${subscription.id}:`, error);
      }
    }
    
    console.log(`✅ Verificación completada: ${snapshot.size} revisadas, ${notificationsSent} notificaciones enviadas`);
    
    return {
      checked: snapshot.size,
      notificationsSent
    };
    
  } catch (error) {
    console.error('❌ Error en verificación de suscripciones:', error);
    throw error;
  }
}

/**
 * Verifica suscripciones expiradas y las marca como inactivas
 */
async function checkExpiredSubscriptions() {
  try {
    console.log('🔍 Verificando suscripciones expiradas...');
    
    const db = admin.firestore();
    const now = new Date();
    const subscriptionsRef = db.collection('subscriptions');
    const snapshot = await subscriptionsRef
      .where('status', '==', 'active')
      .get();
    
    if (snapshot.empty) {
      console.log('ℹ️ No hay suscripciones activas para verificar');
      return 0;
    }
    
    let expiredCount = 0;
    const batch = db.batch();
    
    // Verificar cada suscripción
    snapshot.forEach(doc => {
      const subscription = doc.data();
      const endDate = subscription.endDate?.toDate ? subscription.endDate.toDate() : new Date(subscription.endDate);
      
      // Si ya expiró, marcarla como expired
      if (endDate <= now) {
        batch.update(doc.ref, { 
          status: 'expired',
          expiredAt: admin.firestore.FieldValue.serverTimestamp()
        });
        expiredCount++;
      }
    });
    
    if (expiredCount > 0) {
      await batch.commit();
      console.log(`✅ ${expiredCount} suscripciones marcadas como expiradas`);
    } else {
      console.log('ℹ️ No hay suscripciones expiradas');
    }
    
    return expiredCount;
    
  } catch (error) {
    console.error('❌ Error verificando suscripciones expiradas:', error);
    throw error;
  }
}

/**
 * Ejecuta todas las tareas programadas
 * Esta función debe ser llamada periódicamente (ej: cada hora o cada día)
 */
async function runScheduledTasks() {
  try {
    console.log('⏰ Iniciando tareas programadas...');
    
    const results = {
      timestamp: new Date().toISOString(),
      tasks: {}
    };
    
    // Verificar suscripciones próximas a vencer
    results.tasks.expiringCheck = await checkExpiringSubscriptions();
    
    // Verificar y marcar suscripciones expiradas
    results.tasks.expiredCount = await checkExpiredSubscriptions();
    
    console.log('✅ Tareas programadas completadas:', results);
    return results;
    
  } catch (error) {
    console.error('❌ Error en tareas programadas:', error);
    throw error;
  }
}

module.exports = {
  checkExpiringSubscriptions,
  checkExpiredSubscriptions,
  runScheduledTasks
};
