#!/usr/bin/env node

/**
 * Script de prueba del sistema de notificaciones
 * 
 * Este script demuestra cómo funciona el sistema de notificaciones
 * sin necesidad de configurar toda la aplicación.
 * 
 * Para ejecutar:
 * 1. Configura tu .env con las credenciales de Gmail y Firebase
 * 2. node src/scripts/test-notifications.js
 */

require('dotenv').config();
const emailService = require('../services/email.service');
const notificationService = require('../services/notification.service');

async function testEmailService() {
  console.log('\n🧪 === PRUEBA 1: Servicio de Email ===\n');
  
  try {
    // Detectar servicio configurado
    const emailService = process.env.EMAIL_SERVICE || 'sendgrid';
    console.log(`📧 Servicio de email detectado: ${emailService.toUpperCase()}`);
    
    // Verificar configuración según el servicio
    let configOk = true;
    switch (emailService.toLowerCase()) {
      case 'sendgrid':
        if (!process.env.SENDGRID_API_KEY) {
          console.error('❌ Error: SENDGRID_API_KEY no está configurado en .env');
          configOk = false;
        }
        break;
      case 'brevo':
      case 'sendinblue':
        if (!process.env.BREVO_API_KEY) {
          console.error('❌ Error: BREVO_API_KEY no está configurado en .env');
          configOk = false;
        }
        break;
      case 'resend':
        if (!process.env.RESEND_API_KEY) {
          console.error('❌ Error: RESEND_API_KEY no está configurado en .env');
          configOk = false;
        }
        break;
      case 'gmail':
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
          console.error('❌ Error: SMTP_USER y SMTP_PASS no están configurados en .env');
          configOk = false;
        }
        break;
      default:
        console.error(`❌ Error: Servicio de email no soportado: ${emailService}`);
        configOk = false;
    }
    
    if (!configOk) {
      console.log('\n💡 Verifica tu archivo .env y asegúrate de configurar el servicio elegido.');
      console.log('   Guía: docs/configurar-sendgrid.md');
      return false;
    }
    
    // Verificar conexión
    console.log('1. Verificando configuración de email...');
    const isConnected = await emailService.verifyConnection();
    
    if (!isConnected) {
      console.error('❌ Error: No se pudo conectar al servicio de email');
      console.log('\n💡 Verifica:');
      console.log('   - La API Key está correcta');
      console.log('   - Tienes conexión a internet');
      console.log('   - El servicio está activo');
      return false;
    }
    
    console.log('✅ Conexión al servicio de email OK\n');
    return true;
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

async function testNotificationService() {
  console.log('\n🧪 === PRUEBA 2: Servicio de Notificaciones ===\n');
  
  // Determinar email de destino
  const testEmail = process.env.EMAIL_FROM || process.env.SMTP_USER || 'test@example.com';
  
  if (testEmail === 'test@example.com') {
    console.error('❌ Error: No se configuró EMAIL_FROM o SMTP_USER en .env');
    console.log('\n💡 Agrega EMAIL_FROM=tu-email@ejemplo.com en tu .env');
    return false;
  }
  
  console.log(`📧 Se enviará un email de prueba a: ${testEmail}\n`);
  
  try {
    // Test 1: Notificación de suscripción recibida
    console.log('1. Probando notificación de suscripción recibida...');
    await notificationService.sendSubscriptionReceivedNotification({
      userEmail: testEmail,
      userName: 'Usuario de Prueba',
      planName: 'Plan Premium',
      subscriptionId: `test_${Date.now()}`
    });
    console.log('✅ Email de suscripción enviado\n');
    
    // Test 2: Notificación de plan próximo a vencer
    console.log('2. Probando notificación de plan próximo a vencer...');
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7); // Vence en 7 días
    
    await notificationService.sendPlanExpirationNotification({
      userEmail: testEmail,
      userName: 'Usuario de Prueba',
      planName: 'Plan Premium',
      expirationDate: expirationDate.toISOString(),
      daysRemaining: 7
    });
    console.log('✅ Email de expiración enviado\n');
    
    // Test 3: Notificación de plan renovado
    console.log('3. Probando notificación de plan renovado...');
    const newExpirationDate = new Date();
    newExpirationDate.setMonth(newExpirationDate.getMonth() + 1); // +1 mes
    
    await notificationService.sendPlanRenewalNotification({
      userEmail: testEmail,
      userName: 'Usuario de Prueba',
      planName: 'Plan Premium',
      newExpirationDate: newExpirationDate.toISOString()
    });
    console.log('✅ Email de renovación enviado\n');
    
    console.log('✅ TODAS LAS NOTIFICACIONES SE ENVIARON CORRECTAMENTE\n');
    console.log(`📬 Revisa tu bandeja de entrada: ${testEmail}`);
    return true;
    
  } catch (error) {
    console.error('❌ Error enviando notificaciones:', error.message);
    return false;
  }
}

async function main() {
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║  🧪 SISTEMA DE NOTIFICACIONES - PRUEBA COMPLETA  🧪  ║');
  console.log('╚═══════════════════════════════════════════════════════╝');
  
  // Verificar variables de entorno
  const emailService = process.env.EMAIL_SERVICE || 'sendgrid';
  const hasConfig = 
    process.env.SENDGRID_API_KEY || 
    process.env.BREVO_API_KEY || 
    process.env.RESEND_API_KEY || 
    (process.env.SMTP_USER && process.env.SMTP_PASS);
  
  if (!hasConfig) {
    console.error('\n❌ ERROR: No se configuró ningún servicio de email\n');
    console.log('Configura UNO de estos servicios en tu .env:');
    console.log('\n1. SendGrid (Recomendado - sin 2FA):');
    console.log('   EMAIL_SERVICE=sendgrid');
    console.log('   SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    console.log('   EMAIL_FROM=notificaciones@tuapp.com');
    console.log('\n2. Brevo (300 emails/día):');
    console.log('   EMAIL_SERVICE=brevo');
    console.log('   BREVO_API_KEY=tu-api-key');
    console.log('   EMAIL_FROM=notificaciones@tuapp.com');
    console.log('\n3. Gmail (requiere 2FA):');
    console.log('   EMAIL_SERVICE=gmail');
    console.log('   SMTP_USER=tucorreo@gmail.com');
    console.log('   SMTP_PASS=tu-contraseña-de-aplicacion');
    console.log('\n👉 Guía completa: docs/configurar-sendgrid.md');
    console.log('👉 Copia .env.example a .env y configúralo.\n');
    process.exit(1);
  }
  
  // Ejecutar pruebas
  const emailOk = await testEmailService();
  
  if (!emailOk) {
    console.log('\n❌ Las pruebas fallaron. Revisa tu configuración.\n');
    process.exit(1);
  }
  
  const notificationsOk = await testNotificationService();
  
  if (notificationsOk) {
    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║          ✅ ¡TODAS LAS PRUEBAS PASARON! ✅           ║');
    console.log('╚═══════════════════════════════════════════════════════╝\n');
    console.log('🎉 El sistema de notificaciones está funcionando correctamente.\n');
  } else {
    console.log('\n❌ Algunas pruebas fallaron. Revisa los errores anteriores.\n');
    process.exit(1);
  }
}

// Ejecutar
main().catch(error => {
  console.error('\n❌ Error fatal:', error);
  process.exit(1);
});
