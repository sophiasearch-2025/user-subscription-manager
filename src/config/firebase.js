const admin = require('firebase-admin');
const path = require('path');

// Lee las credenciales desde el archivo JSON
const serviceAccountPath = path.join(__dirname, '../../serviceAccountKey.json');
const serviceAccount = require(serviceAccountPath);

// Inicializa Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID
  });
}

// Exporta Firestore
const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth, admin };
