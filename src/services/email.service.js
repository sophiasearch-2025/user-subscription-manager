// Servicio de envío de emails usando Nodemailer
const nodemailer = require('nodemailer');

/**
 * Configuración del transportador de email
 */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false, // true para 465, false para otros puertos
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

/**
 * Plantilla HTML para email de suscripción recibida
 */
function getSubscriptionReceivedTemplate(data) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .footer { padding: 10px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>¡Solicitud Recibida!</h1>
        </div>
        <div class="content">
          <p>Hola <strong>${data.userName}</strong>,</p>
          <p>Hemos recibido tu solicitud de suscripción al plan <strong>${data.planName}</strong>.</p>
          <p><strong>ID de suscripción:</strong> ${data.subscriptionId}</p>
          <p>Te notificaremos cuando tu suscripción sea activada.</p>
          <p>Gracias por confiar en nosotros.</p>
        </div>
        <div class="footer">
          <p>Este es un email automático, por favor no respondas.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Plantilla HTML para email de plan próximo a vencer
 */
function getPlanExpiringTemplate(data) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #FF9800; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .warning { background: #FFF3CD; border-left: 4px solid #FF9800; padding: 15px; margin: 20px 0; }
        .button { display: inline-block; padding: 10px 20px; background: #FF9800; color: white; text-decoration: none; border-radius: 5px; }
        .footer { padding: 10px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⚠️ Tu plan está por vencer</h1>
        </div>
        <div class="content">
          <p>Hola <strong>${data.userName}</strong>,</p>
          <div class="warning">
            <p>Tu plan <strong>${data.planName}</strong> vencerá en <strong>${data.daysRemaining} días</strong>.</p>
            <p><strong>Fecha de vencimiento:</strong> ${new Date(data.expirationDate).toLocaleDateString('es-ES', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
          </div>
          <p>Renueva tu plan para seguir disfrutando de todos los beneficios.</p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/renovar" class="button">Renovar Ahora</a>
          </p>
        </div>
        <div class="footer">
          <p>Este es un email automático, por favor no respondas.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Plantilla HTML para email de plan renovado
 */
function getPlanRenewedTemplate(data) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2196F3; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .success { background: #D4EDDA; border-left: 4px solid #28A745; padding: 15px; margin: 20px 0; }
        .footer { padding: 10px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Plan Renovado</h1>
        </div>
        <div class="content">
          <p>Hola <strong>${data.userName}</strong>,</p>
          <div class="success">
            <p>Tu plan <strong>${data.planName}</strong> ha sido renovado exitosamente.</p>
            <p><strong>Nueva fecha de vencimiento:</strong> ${new Date(data.newExpirationDate).toLocaleDateString('es-ES', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
          </div>
          <p>Gracias por continuar con nosotros.</p>
        </div>
        <div class="footer">
          <p>Este es un email automático, por favor no respondas.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Envía un email
 * @param {Object} message - Mensaje de la cola con formato { type, to, subject, data }
 */
async function sendEmail(message) {
  try {
    let htmlContent = '';
    
    // Seleccionar plantilla según el tipo
    switch (message.type) {
      case 'SUBSCRIPTION_RECEIVED':
        htmlContent = getSubscriptionReceivedTemplate(message.data);
        break;
      case 'PLAN_EXPIRING':
        htmlContent = getPlanExpiringTemplate(message.data);
        break;
      case 'PLAN_RENEWED':
        htmlContent = getPlanRenewedTemplate(message.data);
        break;
      default:
        throw new Error(`Tipo de email no soportado: ${message.type}`);
    }

    const mailOptions = {
      from: `"Sistema de Suscripciones" <${process.env.SMTP_USER}>`,
      to: message.to,
      subject: message.subject,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email enviado:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error enviando email:', error);
    throw error;
  }
}

/**
 * Verifica la configuración del servicio de email
 */
async function verifyConnection() {
  try {
    await transporter.verify();
    console.log('✅ Servicio de email configurado correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error en configuración de email:', error);
    return false;
  }
}

module.exports = {
  sendEmail,
  verifyConnection
};

