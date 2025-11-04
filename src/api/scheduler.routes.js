// Rutas para tareas programadas (scheduler)
const express = require('express');
const router = express.Router();
const schedulerService = require('../services/scheduler.service');

/**
 * POST /api/scheduler/run
 * Ejecuta manualmente todas las tareas programadas
 * 
 * Esta ruta puede ser llamada:
 * 1. Manualmente desde el frontend o Postman
 * 2. Por un cron job externo (ej: cron-job.org - gratis)
 * 3. Por un servicio de webhooks programados (ej: EasyCron, cron-job.org)
 */
router.post('/run', async (req, res) => {
  try {
    console.log('🚀 Ejecutando tareas programadas manualmente...');
    const results = await schedulerService.runScheduledTasks();
    
    res.json({
      success: true,
      message: 'Tareas programadas ejecutadas exitosamente',
      data: results
    });
  } catch (error) {
    console.error('Error ejecutando tareas programadas:', error);
    res.status(500).json({
      success: false,
      message: 'Error ejecutando tareas programadas',
      error: error.message
    });
  }
});

/**
 * POST /api/scheduler/check-expiring
 * Verifica solo suscripciones próximas a vencer
 */
router.post('/check-expiring', async (req, res) => {
  try {
    const results = await schedulerService.checkExpiringSubscriptions();
    
    res.json({
      success: true,
      message: 'Verificación de suscripciones completada',
      data: results
    });
  } catch (error) {
    console.error('Error verificando suscripciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error verificando suscripciones',
      error: error.message
    });
  }
});

/**
 * POST /api/scheduler/check-expired
 * Verifica y marca suscripciones expiradas
 */
router.post('/check-expired', async (req, res) => {
  try {
    const count = await schedulerService.checkExpiredSubscriptions();
    
    res.json({
      success: true,
      message: `${count} suscripciones marcadas como expiradas`,
      data: { expiredCount: count }
    });
  } catch (error) {
    console.error('Error verificando suscripciones expiradas:', error);
    res.status(500).json({
      success: false,
      message: 'Error verificando suscripciones expiradas',
      error: error.message
    });
  }
});

/**
 * GET /api/scheduler/status
 * Obtiene el estado del servicio de scheduler
 */
router.get('/status', (req, res) => {
  res.json({
    success: true,
    message: 'Servicio de scheduler activo',
    data: {
      status: 'active',
      timestamp: new Date().toISOString()
    }
  });
});

module.exports = router;
