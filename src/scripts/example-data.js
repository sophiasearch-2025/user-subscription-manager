/**
 * Datos de ejemplo para Firestore
 * 
 * Este archivo muestra la estructura de datos que debes crear en Firestore
 * para probar el sistema de notificaciones.
 * 
 * Puedes importar estos datos manualmente en Firebase Console o usar el script seed.js
 */

// Colección: users
const exampleUsers = [
  {
    id: 'user_001',
    name: 'Juan Pérez',
    email: 'juan@example.com',
    phone: '+52 1234567890',
    createdAt: '2024-01-15T10:00:00.000Z',
    status: 'active'
  },
  {
    id: 'user_002',
    name: 'María García',
    email: 'maria@example.com',
    phone: '+52 9876543210',
    createdAt: '2024-02-20T14:30:00.000Z',
    status: 'active'
  }
];

// Colección: subscriptions
const exampleSubscriptions = [
  {
    id: 'sub_001',
    userId: 'user_001',
    planId: 'plan_premium',
    planName: 'Plan Premium',
    status: 'active',
    startDate: '2024-01-15T10:00:00.000Z',
    expirationDate: '2025-01-15T10:00:00.000Z', // Vence en el futuro
    price: 99.99,
    currency: 'MXN',
    autoRenew: true,
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-15T10:00:00.000Z'
  },
  {
    id: 'sub_002',
    userId: 'user_002',
    planId: 'plan_basic',
    planName: 'Plan Básico',
    status: 'active',
    startDate: '2024-02-20T14:30:00.000Z',
    // Esta suscripción vence en 7 días (ajusta la fecha según necesites)
    expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    price: 49.99,
    currency: 'MXN',
    autoRenew: false,
    createdAt: '2024-02-20T14:30:00.000Z',
    updatedAt: '2024-02-20T14:30:00.000Z'
  },
  {
    id: 'sub_003',
    userId: 'user_001',
    planId: 'plan_pro',
    planName: 'Plan Profesional',
    status: 'active',
    startDate: '2024-03-10T09:00:00.000Z',
    // Esta suscripción vence en 3 días (ajusta la fecha según necesites)
    expirationDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    price: 149.99,
    currency: 'MXN',
    autoRenew: true,
    createdAt: '2024-03-10T09:00:00.000Z',
    updatedAt: '2024-03-10T09:00:00.000Z'
  }
];

// Colección: plans (opcional, para referencia)
const examplePlans = [
  {
    id: 'plan_basic',
    name: 'Plan Básico',
    description: 'Ideal para comenzar',
    price: 49.99,
    currency: 'MXN',
    duration: 30, // días
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

// Instrucciones para importar en Firestore
console.log(`
╔═══════════════════════════════════════════════════════════════╗
║          DATOS DE EJEMPLO PARA FIRESTORE                      ║
╚═══════════════════════════════════════════════════════════════╝

Para probar el sistema de notificaciones, necesitas crear estas colecciones
en Firebase Firestore:

1. COLECCIÓN: users
   - Ve a Firebase Console → Firestore Database
   - Crea la colección "users"
   - Agrega documentos con los datos de exampleUsers

2. COLECCIÓN: subscriptions
   - Crea la colección "subscriptions"
   - Agrega documentos con los datos de exampleSubscriptions
   - IMPORTANTE: Ajusta las fechas de expirationDate para que sean futuras

3. COLECCIÓN: plans (opcional)
   - Crea la colección "plans"
   - Agrega documentos con los datos de examplePlans

ALTERNATIVA: Usa el script seed.js para importar automáticamente:
   node src/scripts/seed.js

PROBAR EL SISTEMA:
   1. Asegúrate de tener suscripciones con status='active'
   2. Ajusta expirationDate para que algunas venzan en 7, 3 o 1 día
   3. Ejecuta: curl -X POST http://localhost:3000/api/scheduler/run
   4. Verifica que se enviaron los emails

`);

module.exports = {
  exampleUsers,
  exampleSubscriptions,
  examplePlans
};
