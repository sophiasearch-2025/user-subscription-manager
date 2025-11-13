#!/usr/bin/env node

/**
 * Script simple para probar Resend
 * No requiere Firebase, solo prueba el envío de emails
 */

const nodemailer = require('nodemailer');

console.log('\n╔═══════════════════════════════════════════════════════╗');
console.log('║        🧪 PROBANDO RESEND - Envío de Email 🧪       ║');
console.log('╚═══════════════════════════════════════════════════════╝\n');

// Configuración de Resend
const transporter = nodemailer.createTransport({
  host: 'smtp.resend.com',
  port: 587,
  auth: {
    user: 'resend',
    pass: 're_CDuyapBZ_J4RxAwxocXRnpJFmc5HRCsjp'
  }
});

// Email de prueba
const mailOptions = {
  from: 'onboarding@resend.dev',
  to: 'sophiausers@gmail.com', // Email con el que te registraste en Resend
  subject: '🎉 ¡Resend funciona! - Prueba del Sistema',
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px; }
        .content { padding: 20px; background: #f9f9f9; margin-top: 20px; border-radius: 5px; }
        .success { background: #D4EDDA; border-left: 4px solid #28A745; padding: 15px; margin: 20px 0; }
        .footer { padding: 10px; text-align: center; font-size: 12px; color: #666; margin-top: 20px; }
        .emoji { font-size: 48px; text-align: center; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ ¡Email de Prueba Exitoso!</h1>
        </div>
        <div class="content">
          <div class="emoji">🎉</div>
          <h2>¡Felicidades!</h2>
          <div class="success">
            <p><strong>Tu configuración de Resend está funcionando perfectamente.</strong></p>
          </div>
          <p>Esto confirma que:</p>
          <ul>
            <li>✅ Tu API Key de Resend es válida</li>
            <li>✅ El servicio de email está configurado correctamente</li>
            <li>✅ Puedes enviar hasta 100 emails por día GRATIS</li>
            <li>✅ El sistema está listo para enviar notificaciones</li>
          </ul>
          <p><strong>Próximo paso:</strong> Una vez que Firebase esté configurado, podrás usar el sistema completo de notificaciones automáticas.</p>
          <p style="margin-top: 30px; padding: 15px; background: white; border-radius: 5px;">
            <strong>📊 Detalles técnicos:</strong><br>
            Servicio: Resend<br>
            Fecha: ${new Date().toLocaleString('es-ES')}<br>
            Sistema: User Subscription Manager
          </p>
        </div>
        <div class="footer">
          <p>Este es un email de prueba del sistema de notificaciones</p>
          <p>Sistema de Gestión de Suscripciones</p>
        </div>
      </div>
    </body>
    </html>
  `
};

console.log('📧 Configuración:');
console.log('   Servicio: Resend');
console.log('   API Key: re_CDuyapBZ... (configurada)');
console.log('   Destinatario: ⚠️  ACTUALIZA "to" en línea 22 con tu email real\n');

console.log('📤 Enviando email de prueba...\n');

transporter.sendMail(mailOptions)
  .then((info) => {
    console.log('╔═══════════════════════════════════════════════════════╗');
    console.log('║              ✅ EMAIL ENVIADO EXITOSAMENTE ✅        ║');
    console.log('╚═══════════════════════════════════════════════════════╝\n');
    console.log('📬 Detalles:');
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   Respuesta: ${info.response}\n`);
    console.log('🎉 ¡Revisa tu bandeja de entrada!');
    console.log('   (Si no lo ves, revisa la carpeta de Spam)\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('✅ Resend está configurado correctamente');
    console.log('⏳ Esperando que tu colega termine con Firebase...');
    console.log('📚 Cuando esté listo, ejecuta: npm run test:notifications\n');
  })
  .catch((error) => {
    console.log('╔═══════════════════════════════════════════════════════╗');
    console.log('║                ❌ ERROR AL ENVIAR EMAIL             ║');
    console.log('╚═══════════════════════════════════════════════════════╝\n');
    console.error('❌ Error:', error.message);
    console.log('\n💡 Posibles causas:');
    console.log('   1. API Key incorrecta (verifica en .env)');
    console.log('   2. Email "to" no válido (actualízalo en línea 22)');
    console.log('   3. Sin conexión a internet');
    console.log('   4. Límite de emails alcanzado (100/día)\n');
  });
