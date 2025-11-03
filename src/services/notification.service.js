// Servicio de notificaciones - Envia mensajes a la cola de RabbitMQ

const amqp = require('amqplib');

const QUEUE_NAME = 'email_notifications';
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';

let channel = null;

/**
 * Conecta a RabbitMQ y crea el canal
 */
async function connect() {
  try {
    if (!channel) {
      const connection = await amqp.connect(RABBITMQ_URL);
      channel = await connection.createChannel();
      await channel.assertQueue(QUEUE_NAME, { durable: true });
      console.log('✅ Conectado a RabbitMQ');
    }
    return channel;
  } catch (error) {
    console.error('❌ Error conectando a RabbitMQ:', error);
    throw error;
  }
}

/**
 * Envía notificación de suscripción recibida
 * @param {Object} data - { userEmail, userName, planName, subscriptionId }
 */
async function sendSubscriptionReceivedNotification(data) {
  try {
    const ch = await connect();
    const message = {
      type: 'SUBSCRIPTION_RECEIVED',
      to: data.userEmail,
      subject: '¡Solicitud de suscripción recibida!',
      data: {
        userName: data.userName,
        planName: data.planName,
        subscriptionId: data.subscriptionId,
        timestamp: new Date()
      }
    };
    
    ch.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)), {
      persistent: true
    });
    
    console.log('📧 Notificación de suscripción enviada a cola:', data.userEmail);
    return true;
  } catch (error) {
    console.error('Error enviando notificación de suscripción:', error);
    throw error;
  }
}

/**
 * Envía notificación de plan próximo a vencer
 * @param {Object} data - { userEmail, userName, planName, expirationDate, daysRemaining }
 */
async function sendPlanExpirationNotification(data) {
  try {
    const ch = await connect();
    const message = {
      type: 'PLAN_EXPIRING',
      to: data.userEmail,
      subject: `Tu plan ${data.planName} está por vencer`,
      data: {
        userName: data.userName,
        planName: data.planName,
        expirationDate: data.expirationDate,
        daysRemaining: data.daysRemaining,
        timestamp: new Date()
      }
    };
    
    ch.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)), {
      persistent: true
    });
    
    console.log('⏰ Notificación de expiración enviada a cola:', data.userEmail);
    return true;
  } catch (error) {
    console.error('Error enviando notificación de expiración:', error);
    throw error;
  }
}

/**
 * Envía notificación de renovación de plan
 * @param {Object} data - { userEmail, userName, planName, newExpirationDate }
 */
async function sendPlanRenewalNotification(data) {
  try {
    const ch = await connect();
    const message = {
      type: 'PLAN_RENEWED',
      to: data.userEmail,
      subject: `Tu plan ${data.planName} ha sido renovado`,
      data: {
        userName: data.userName,
        planName: data.planName,
        newExpirationDate: data.newExpirationDate,
        timestamp: new Date()
      }
    };
    
    ch.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)), {
      persistent: true
    });
    
    console.log('🔄 Notificación de renovación enviada a cola:', data.userEmail);
    return true;
  } catch (error) {
    console.error('Error enviando notificación de renovación:', error);
    throw error;
  }
}

module.exports = {
  sendSubscriptionReceivedNotification,
  sendPlanExpirationNotification,
  sendPlanRenewalNotification,
  connect
};
