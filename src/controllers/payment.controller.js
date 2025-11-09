// Controlador de pagos
const { db } = require('../config/firebase');

/**
 * Obtener todos los pagos
 */
async function getAllPayments(req, res) {
  try {
    const paymentsRef = db.collection('payments');
    const snapshot = await paymentsRef.orderBy('createdAt', 'desc').get();
    
    const payments = [];
    snapshot.forEach(doc => {
      payments.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json({
      success: true,
      data: payments
    });
  } catch (error) {
    console.error('Error obteniendo pagos:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

/**
 * Obtener un pago por ID
 */
async function getPaymentById(req, res) {
  try {
    const { id } = req.params;
    const docRef = db.collection('payments').doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Pago no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: {
        id: doc.id,
        ...doc.data()
      }
    });
  } catch (error) {
    console.error('Error obteniendo pago:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

/**
 * Obtener pagos de un usuario
 */
async function getPaymentsByUser(req, res) {
  try {
    const { userId } = req.params;
    const paymentsRef = db.collection('payments');
    const snapshot = await paymentsRef
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
    
    const payments = [];
    snapshot.forEach(doc => {
      payments.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.json({
      success: true,
      data: payments
    });
  } catch (error) {
    console.error('Error obteniendo pagos del usuario:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

module.exports = {
  getAllPayments,
  getPaymentById,
  getPaymentsByUser
};
