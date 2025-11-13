// Worker para procesar cola de emails de notificaciones
const amqp = require('amqplib');
const emailService = require('../services/email.service');
require('dotenv').config();

const QUEUE_NAME = 'email_notifications';
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';

async function startWorker() {
  try {
    console.log('🚀 Iniciando worker de emails...');
    
    // Conectar a RabbitMQ
    console.log('📡 Conectando a RabbitMQ...');
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    
    // Asegurar que la cola existe
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    
    // Procesar solo 1 mensaje a la vez
    channel.prefetch(1);
    
    console.log('✅ Worker de emails iniciado y esperando mensajes...');
    console.log(`📬 Cola: ${QUEUE_NAME}`);
    
    // Verificar conexión del servicio de email
    await emailService.verifyConnection();
    
    // Consumir mensajes de la cola
    channel.consume(QUEUE_NAME, async (msg) => {
      if (msg !== null) {
        try {
          const message = JSON.parse(msg.content.toString());
          console.log(`\n📨 Procesando mensaje tipo: ${message.type}`);
          console.log(`📧 Destinatario: ${message.to}`);
          
          // Enviar el email
          await emailService.sendEmail(message);
          
          // Confirmar que el mensaje fue procesado
          channel.ack(msg);
          console.log('✅ Mensaje procesado exitosamente\n');
          
        } catch (error) {
          console.error('❌ Error procesando mensaje:', error);
          
          // Rechazar el mensaje y reenviarlo a la cola
          // Si falla 3 veces, se descarta
          channel.nack(msg, false, true);
        }
      }
    });
    
    // Manejar cierre de conexión
    connection.on('close', () => {
      console.log('⚠️ Conexión cerrada, reintentando en 5 segundos...');
      setTimeout(startWorker, 5000);
    });
    
    connection.on('error', (err) => {
      console.error('❌ Error de conexión:', err);
      setTimeout(startWorker, 5000);
    });
    
  } catch (error) {
    console.error('❌ Error al iniciar worker:', error);
    console.log('🔄 Reintentando en 5 segundos...');
    setTimeout(startWorker, 5000);
  }
}

// Manejar señales de terminación
process.on('SIGINT', () => {
  console.log('\n⏹️  Worker detenido');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n⏹️  Worker detenido');
  process.exit(0);
});

// Iniciar el worker
startWorker();

