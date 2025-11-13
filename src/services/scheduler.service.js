// Servicio para verificación periódica de suscripciones
const { db } = require('../config/firebase');
const emailService = require('./email.service');

/**
 * Verifica todas las suscripciones activas y envía notificaciones
 * para las que están próximas a vencer
 * 
 * Se envían notificaciones en:
 * - 7 días antes del vencimiento
 * - 3 días antes del vencimiento
 * - 1 día antes del vencimiento
 */
async function checkExpiringSubscriptions() {
  try {
    console.log('🔍 Iniciando verificación de suscripciones...');
    
    const now = new Date();
    const notificationDays = [7, 3, 1]; // Días antes del vencimiento para notificar
    
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
      const expirationDate = new Date(subscription.expirationDate);
      const daysUntilExpiration = Math.ceil((expirationDate - now) / (1000 * 60 * 60 * 24));
      
      // Verificar si necesita notificación
      if (notificationDays.includes(daysUntilExpiration)) {
        // Verificar si ya se envió notificación hoy
        const lastNotification = subscription.lastExpirationNotification 
          ? new Date(subscription.lastExpirationNotification)
          : null;
        
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        
        // Solo enviar si no se ha enviado notificación hoy
        if (!lastNotification || lastNotification < todayStart) {
          subscriptionsToNotify.push({
            id: doc.id,
            ...subscription,
            daysRemaining: daysUntilExpiration
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
          planName: subscription.planName || 'Plan Premium',
          expirationDate: subscription.expirationDate,
          daysRemaining: subscription.daysRemaining
        });
        
        // Actualizar marca de notificación enviada
        await db.collection('subscriptions').doc(subscription.id).update({
          lastExpirationNotification: now.toISOString()
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
    
    const now = new Date();
    const subscriptionsRef = db.collection('subscriptions');
    const snapshot = await subscriptionsRef
      .where('status', '==', 'active')
      .where('expirationDate', '<=', now.toISOString())
      .get();
    
    if (snapshot.empty) {
      console.log('ℹ️ No hay suscripciones expiradas');
      return 0;
    }
    
    let expiredCount = 0;
    const batch = db.batch();
    
    snapshot.forEach(doc => {
      batch.update(doc.ref, { 
        status: 'expired',
        expiredAt: now.toISOString()
      });
      expiredCount++;
    });
    
    await batch.commit();
    console.log(`✅ ${expiredCount} suscripciones marcadas como expiradas`);
    
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
