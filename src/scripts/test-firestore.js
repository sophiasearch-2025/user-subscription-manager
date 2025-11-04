/**
 * Script de prueba para los modelos de Firestore
 * 
 * Ejecuta con: node src/scripts/test-firestore.js
 */

require('dotenv').config();
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const Payment = require('../models/Payment');

async function testModels() {
  console.log('🧪 Iniciando pruebas de modelos...\n');

  try {
    // ========================================
    // 1. CREAR UN USUARIO
    // ========================================
    console.log('📝 Creando usuario de prueba...');
    
    const testUser = await User.create({
      uid: 'test_user_' + Date.now(),
      email: 'test@example.com',
      name: 'Juan Pérez',
      company: 'Mi Empresa S.A.',
      estado: 'active',
      role: 'user'
    });
    
    console.log('✅ Usuario creado:', testUser);
    console.log('');

    // ========================================
    // 2. OBTENER EL USUARIO
    // ========================================
    console.log('🔍 Obteniendo usuario por UID...');
    
    const retrievedUser = await User.getByUid(testUser.uid);
    console.log('✅ Usuario encontrado:', retrievedUser.email);
    console.log('');

    // ========================================
    // 3. CREAR UNA SUSCRIPCIÓN
    // ========================================
    console.log('📝 Creando suscripción...');
    
    const testSubscription = await Subscription.create({
      userId: testUser.uid,
      plan: 'premium',
      descripcion: 'Plan Premium Mensual',
      precio: 29.99,
      status: 'active',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 días
    });
    
    console.log('✅ Suscripción creada:', testSubscription);
    console.log('');

    // ========================================
    // 4. CREAR UN PAGO
    // ========================================
    console.log('📝 Creando pago...');
    
    const testPayment = await Payment.create({
      userId: testUser.uid,
      subscriptionId: testSubscription.id,
      amount: 29.99,
      currency: 'usd',
      status: 'succeeded',
      fechaTransferencia: new Date()
    });
    
    console.log('✅ Pago creado:', testPayment);
    console.log('');

    // ========================================
    // 5. LISTAR SUSCRIPCIONES DEL USUARIO
    // ========================================
    console.log('🔍 Obteniendo suscripciones del usuario...');
    
    const userSubscriptions = await Subscription.getByUserId(testUser.uid);
    console.log(`✅ Encontradas ${userSubscriptions.length} suscripciones`);
    console.log('');

    // ========================================
    // 6. LISTAR PAGOS DEL USUARIO
    // ========================================
    console.log('🔍 Obteniendo pagos del usuario...');
    
    const userPayments = await Payment.getByUserId(testUser.uid);
    console.log(`✅ Encontrados ${userPayments.length} pagos`);
    console.log('');

    // ========================================
    // 7. ACTUALIZAR USUARIO
    // ========================================
    console.log('📝 Actualizando usuario...');
    
    const updatedUser = await User.update(testUser.uid, {
      company: 'Nueva Empresa Actualizada'
    });
    
    console.log('✅ Usuario actualizado:', updatedUser.company);
    console.log('');

    // ========================================
    // 8. CANCELAR SUSCRIPCIÓN
    // ========================================
    console.log('❌ Cancelando suscripción...');
    
    const cancelledSubscription = await Subscription.cancel(testSubscription.id, true);
    console.log('✅ Suscripción cancelada:', cancelledSubscription.cancelAtPeriodEnd);
    console.log('');

    // ========================================
    // LIMPIEZA (Opcional - descomenta si quieres borrar los datos de prueba)
    // ========================================
    /*
    console.log('🧹 Limpiando datos de prueba...');
    await Payment.delete(testPayment.id);
    await Subscription.delete(testSubscription.id);
    await User.delete(testUser.uid);
    console.log('✅ Datos de prueba eliminados');
    */

    console.log('\n✅ ¡Todas las pruebas completadas exitosamente!');
    console.log('');
    console.log('📊 Resumen:');
    console.log(`   - Usuario: ${testUser.email}`);
    console.log(`   - Suscripción: ${testSubscription.plan} - $${testSubscription.precio}`);
    console.log(`   - Pago: $${testPayment.amount} ${testPayment.currency}`);
    console.log('');
    console.log('🔥 Puedes ver estos datos en Firebase Console:');
    console.log('   https://console.firebase.google.com/project/sophiasearch-2025-c48ca/firestore');

    process.exit(0);

  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
    process.exit(1);
  }
}

// Ejecutar pruebas
testModels();
