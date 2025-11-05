// Punto de entrada de la aplicación
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares de seguridad
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // límite de 100 requests por IP
});
app.use('/api/', limiter);

// Rutas
const subscriptionRoutes = require('./api/subscription.routes');
// const authRoutes = require('./api/auth.routes');
const userRoutes = require('./api/user.routes');

// Montar rutas
app.use('/api/subscriptions', subscriptionRoutes);
// app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Ruta de health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'user-subscription-system'
  });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'User Subscription System API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      subscriptions: '/api/subscriptions',
      // auth: '/api/auth',
      // users: '/api/users'
    }
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint no encontrado'
  });
});

// Manejo de errores global
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Error interno del servidor'
  });
});

// Iniciar servidor solo cuando se ejecuta directamente (no al requerir en tests)
if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`📡 API disponible en http://localhost:${PORT}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  });

  // Manejo de señales de terminación
  process.on('SIGINT', () => {
    console.log('\n⏹️  Servidor detenido');
    server.close(() => process.exit(0));
  });

  process.on('SIGTERM', () => {
    console.log('\n⏹️  Servidor detenido');
    server.close(() => process.exit(0));
  });
}

module.exports = app;

