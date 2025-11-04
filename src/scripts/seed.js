#!/usr/bin/env node

/**
 * Script para poblar Firestore con datos de prueba
 * 
 * Este script crea usuarios, suscripciones y planes de ejemplo
 * para probar el sistema de notificaciones.
 * 
 * Para ejecutar:
 * 1. Configura tu .env con FIREBASE_PROJECT_ID
 * 2. Asegúrate de tener serviceAccountKey.json en la raíz
 * 3. node src/scripts/seed.js
 */

require('dotenv').config();
const { db } = require('../config/firebase');

// Datos de ejemplo
const users = [
  {
    id: 'user_001',
    name: 'Juan Pérez',
    email: process.env.EMAIL_FROM || process.env.SMTP_USER || 'juan@example.com', // Usa tu email para recibir notificaciones
    phone: '+52 1234567890',
    createdAt: new Date().toISOString(),
    status: 'active'
  },
  {
    id: 'user_002',
    name: 'María García',
    email: 'maria@example.com',
    phone: '+52 9876543210',
    createdAt: new Date().toISOString(),
    status: 'active'
  }
];

// Suscripciones con diferentes fechas de vencimiento
const subscriptions = [
  {
    id: 'sub_001',
    userId: 'user_001',
    planId: 'plan_premium',
    planName: 'Plan Premium',
    status: 'active',
    startDate: new Date().toISOString(),
    expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Vence en 7 días
    price: 99.99,
    currency: 'MXN',
    autoRenew: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'sub_002',
    userId: 'user_001',
    planId: 'plan_basic',
    planName: 'Plan Básico',
    status: 'active',
    startDate: new Date().toISOString(),
    expirationDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // Vence en 3 días
    price: 49.99,
    currency: 'MXN',
    autoRenew: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'sub_003',
    userId: 'user_002',
    planId: 'plan_pro',
    planName: 'Plan Profesional',
    status: 'active',
    startDate: new Date().toISOString(),
    expirationDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // Vence en 1 día
    price: 149.99,
    currency: 'MXN',
    autoRenew: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'sub_004',
    userId: 'user_002',
    planId: 'plan_premium',
    planName: 'Plan Premium',
    status: 'active',
    startDate: new Date().toISOString(),
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Vence en 30 días
    price: 99.99,
    currency: 'MXN',
    autoRenew: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Planes disponibles
const plans = [
  {
    id: 'plan_basic',
    name: 'Plan Básico',
    description: 'Ideal para comenzar',
    price: 49.99,
    currency: 'MXN',
    duration: 30,
    features: [
      'Acceso básico',
      'Soporte por email',
      '1 usuario'
    ],
    active: true
  },
  {
    id: 'plan_premium',
    name: 'Plan Premium',
    description: 'Para usuarios avanzados',
    price: 99.99,
    currency: 'MXN',
    duration: 30,
    features: [
      'Acceso completo',
      'Soporte prioritario',
      'Hasta 5 usuarios',
      'Reportes avanzados'
    ],
    active: true
  },
  {
    id: 'plan_pro',
    name: 'Plan Profesional',
    description: 'Para empresas',
    price: 149.99,
    currency: 'MXN',
    duration: 30,
    features: [
      'Acceso ilimitado',
      'Soporte 24/7',
      'Usuarios ilimitados',
      'API access',
      'Personalización'
    ],
    active: true
  }
];

async function seedUsers() {
  console.log('\n📝 Creando usuarios...');
  
  for (const user of users) {
    try {
      await db.collection('users').doc(user.id).set(user);
      console.log(`  ✅ Usuario creado: ${user.name} (${user.email})`);
    } catch (error) {
      console.error(`  ❌ Error creando usuario ${user.id}:`, error.message);
    }
  }
}

async function seedSubscriptions() {
  console.log('\n📝 Creando suscripciones...');
  
  for (const sub of subscriptions) {
    try {
      await db.collection('subscriptions').doc(sub.id).set(sub);
      const daysUntilExpiration = Math.ceil(
        (new Date(sub.expirationDate) - new Date()) / (1000 * 60 * 60 * 24)
      );
      console.log(`  ✅ Suscripción creada: ${sub.planName} - Vence en ${daysUntilExpiration} días`);
    } catch (error) {
      console.error(`  ❌ Error creando suscripción ${sub.id}:`, error.message);
    }
  }
}

async function seedPlans() {
  console.log('\n📝 Creando planes...');
  
  for (const plan of plans) {
    try {
      await db.collection('plans').doc(plan.id).set(plan);
      console.log(`  ✅ Plan creado: ${plan.name} - $${plan.price} ${plan.currency}`);
    } catch (error) {
      console.error(`  ❌ Error creando plan ${plan.id}:`, error.message);
    }
  }
}

async function clearCollections() {
  console.log('\n🗑️  Limpiando colecciones existentes...');
  
  const collections = ['users', 'subscriptions', 'plans'];
  
  for (const collectionName of collections) {
    try {
      const snapshot = await db.collection(collectionName).get();
      const batch = db.batch();
      
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      console.log(`  ✅ Colección '${collectionName}' limpiada (${snapshot.size} documentos)`);
    } catch (error) {
      console.error(`  ❌ Error limpiando '${collectionName}':`, error.message);
    }
  }
}

async function main() {
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║     🌱 SEED - DATOS DE PRUEBA PARA FIRESTORE 🌱      ║');
  console.log('╚═══════════════════════════════════════════════════════╝');
  
  // Verificar configuración
  if (!process.env.FIREBASE_PROJECT_ID) {
    console.error('\n❌ ERROR: FIREBASE_PROJECT_ID no está configurado en .env\n');
    process.exit(1);
  }
  
  console.log(`\n🔥 Proyecto Firebase: ${process.env.FIREBASE_PROJECT_ID}`);
  
  try {
    // Preguntar si se desea limpiar (en producción usar readline)
    console.log('\n⚠️  Este script creará datos de prueba en Firestore.');
    console.log('⚠️  Las colecciones existentes serán limpiadas.');
    
    // Limpiar colecciones
    await clearCollections();
    
    // Crear datos
    await seedUsers();
    await seedSubscriptions();
    await seedPlans();
    
    console.log('\n');
    console.log('╔═══════════════════════════════════════════════════════╗');
    console.log('║            ✅ SEED COMPLETADO EXITOSAMENTE ✅        ║');
    console.log('╚═══════════════════════════════════════════════════════╝');
    
    console.log('\n📊 Resumen:');
    console.log(`  • ${users.length} usuarios creados`);
    console.log(`  • ${subscriptions.length} suscripciones creadas`);
    console.log(`  • ${plans.length} planes creados`);
    
    console.log('\n🧪 Para probar el sistema de notificaciones:');
    console.log('  1. Inicia el servidor: npm run dev');
    console.log('  2. Ejecuta: curl -X POST http://localhost:3000/api/scheduler/run');
    console.log('  3. Verifica tu email para recibir las notificaciones\n');
    
  } catch (error) {
    console.error('\n❌ Error fatal:', error);
    process.exit(1);
  }
}

// Ejecutar
main().catch(error => {
  console.error('\n❌ Error:', error);
  process.exit(1);
});

