const functions = require('firebase-functions');
// Importa la app Express exportada desde src/app.js
const app = require('../src/app');

// Exporta la app como función HTTP llamada 'api'
exports.api = functions.https.onRequest(app);

// Puedes exportar más funciones aquí si lo necesitas
