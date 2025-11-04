const { db } = require('../config/firebase');

/**
 * Modelo de Pago para Firestore
 */
class Payment {
  constructor(data) {
    this.id = data.id || null;
    this.userId = data.userId;
    this.subscriptionId = data.subscriptionId || null;
    this.stripePaymentIntentId = data.stripePaymentIntentId || null;
    this.amount = data.amount || 0;
    this.currency = data.currency || 'usd';
    this.status = data.status || 'pending'; // succeeded, failed, pending, cancelled
    this.fechaTransferencia = data.fechaTransferencia || new Date();
    this.comprobante = data.comprobante || null; // URL del comprobante/factura
    this.metadata = data.metadata || {};
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  /**
   * Crear un nuevo pago
   */
  static async create(paymentData) {
    try {
      const payment = new Payment(paymentData);
      
      const docRef = await db.collection('payments').add({
        userId: payment.userId,
        subscriptionId: payment.subscriptionId,
        stripePaymentIntentId: payment.stripePaymentIntentId,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        fechaTransferencia: payment.fechaTransferencia,
        comprobante: payment.comprobante,
        metadata: payment.metadata,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      payment.id = docRef.id;
      await docRef.update({ id: docRef.id });
      
      console.log('✅ Pago creado:', payment.id);
      return payment;
    } catch (error) {
      console.error('Error creando pago:', error);
      throw error;
    }
  }

  /**
   * Obtener pago por ID
   */
  static async getById(id) {
    try {
      const doc = await db.collection('payments').doc(id).get();
      
      if (!doc.exists) {
        return null;
      }
      
      return new Payment({ id: doc.id, ...doc.data() });
    } catch (error) {
      console.error('Error obteniendo pago:', error);
      throw error;
    }
  }

  /**
   * Obtener pagos de un usuario
   */
  static async getByUserId(userId, limit = 50) {
    try {
      const snapshot = await db.collection('payments')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();
      
      return snapshot.docs.map(doc => new Payment({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error obteniendo pagos del usuario:', error);
      throw error;
    }
  }

  /**
   * Obtener pagos de una suscripción
   */
  static async getBySubscriptionId(subscriptionId) {
    try {
      const snapshot = await db.collection('payments')
        .where('subscriptionId', '==', subscriptionId)
        .orderBy('createdAt', 'desc')
        .get();
      
      return snapshot.docs.map(doc => new Payment({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error obteniendo pagos de la suscripción:', error);
      throw error;
    }
  }

  /**
   * Obtener pago por Stripe Payment Intent ID
   */
  static async getByStripePaymentIntentId(stripePaymentIntentId) {
    try {
      const snapshot = await db.collection('payments')
        .where('stripePaymentIntentId', '==', stripePaymentIntentId)
        .limit(1)
        .get();
      
      if (snapshot.empty) {
        return null;
      }
      
      const doc = snapshot.docs[0];
      return new Payment({ id: doc.id, ...doc.data() });
    } catch (error) {
      console.error('Error obteniendo pago por Stripe ID:', error);
      throw error;
    }
  }

  /**
   * Actualizar pago
   */
  static async update(id, updateData) {
    try {
      const docRef = db.collection('payments').doc(id);
      
      await docRef.update({
        ...updateData,
        updatedAt: new Date()
      });
      
      console.log('✅ Pago actualizado:', id);
      return await Payment.getById(id);
    } catch (error) {
      console.error('Error actualizando pago:', error);
      throw error;
    }
  }

  /**
   * Eliminar pago
   */
  static async delete(id) {
    try {
      await db.collection('payments').doc(id).delete();
      console.log('✅ Pago eliminado:', id);
      return true;
    } catch (error) {
      console.error('Error eliminando pago:', error);
      throw error;
    }
  }

  /**
   * Listar pagos exitosos
   */
  static async listSucceeded(limit = 50) {
    try {
      const snapshot = await db.collection('payments')
        .where('status', '==', 'succeeded')
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();
      
      return snapshot.docs.map(doc => new Payment({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error listando pagos exitosos:', error);
      throw error;
    }
  }

  /**
   * Calcular total de ingresos
   */
  static async getTotalRevenue() {
    try {
      const snapshot = await db.collection('payments')
        .where('status', '==', 'succeeded')
        .get();
      
      let total = 0;
      snapshot.docs.forEach(doc => {
        total += doc.data().amount || 0;
      });
      
      return total;
    } catch (error) {
      console.error('Error calculando ingresos:', error);
      throw error;
    }
  }
}

module.exports = Payment;
