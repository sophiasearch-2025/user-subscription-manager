#!/usr/bin/env node

/**
 * Script de prueba para verificar notificaciones por email
 * Ejecutar: node src/scripts/test-create-subscription.js
 */

const API_URL = process.env.API_URL || 'http://localhost:3000';

async function testCreateSubscription() {
  console.log('🧪 Iniciando prueba de creación de suscripción con notificación...\n');

  const testData = {
    userId: `user_test_${Date.now()}`,
    planId: 'plan_premium',
    userEmail: process.env.TEST_EMAIL || 'marcelolara2005@gmail.com',
    userName: 'Usuario de Prueba',
    planName: 'Plan Premium',
    precio: 99.99
  };

  console.log('📤 Enviando request a:', `${API_URL}/api/subscriptions`);
  console.log('📋 Datos:', JSON.stringify(testData, null, 2));
  console.log('');

  try {
    const response = await fetch(`${API_URL}/api/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ ÉXITO - Suscripción creada\n');
      console.log('📊 Respuesta:');
      console.log(JSON.stringify(result, null, 2));
      console.log('');
      console.log('🎯 Verifica:');
      console.log(`   1. Email enviado a: ${testData.userEmail}`);
      console.log(`   2. Suscripción en Firebase con ID: ${result.data?.subscriptionId}`);
      console.log(`   3. Notificación registrada en colección 'notifications'`);
      console.log('');
      console.log('📧 Revisa tu bandeja de entrada (incluye spam)');
    } else {
      console.log('❌ ERROR - La suscripción NO se creó\n');
      console.log('📊 Respuesta:');
      console.log(JSON.stringify(result, null, 2));
    }

  } catch (error) {
    console.error('❌ ERROR de conexión:', error.message);
    console.log('');
    console.log('💡 Verifica que el servidor esté corriendo:');
    console.log(`   curl ${API_URL}/api/health`);
  }
}

// Ejecutar
testCreateSubscription();
