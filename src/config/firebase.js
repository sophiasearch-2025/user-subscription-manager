const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Intentar leer credenciales locales sólo si existen (desarrollo)
const serviceAccountPath = path.join(__dirname, '../../serviceAccountKey.json');
let serviceAccount = null;
if (fs.existsSync(serviceAccountPath)) {
  try {
    serviceAccount = require(serviceAccountPath);
  } catch (err) {
    console.warn('No se pudo leer serviceAccountKey.json:', err.message);
    serviceAccount = null;
  }
}

// Inicializa Firebase Admin
if (!admin.apps.length) {
  if (serviceAccount) {
    // Desarrollo local: usar credenciales del archivo JSON
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID || serviceAccount.project_id
    });
  } else {
    // Entorno de production (Cloud Functions / Hosting): usar credenciales del entorno
    admin.initializeApp();
  }
}

// Exporta Firestore y Auth
const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth, admin };
