const { db } = require('../config/firebase');

/**
 * Modelo de Suscripción para Firestore
 */
class Subscription {
  constructor(data) {
    this.id = data.id || null;
    this.userId = data.userId;
    this.stripeSubscriptionId = data.stripeSubscriptionId || null;
    this.stripePriceId = data.stripePriceId || null;
    this.plan = data.plan || 'free'; // free, basic, premium, enterprise
    this.descripcion = data.descripcion || '';
    this.precio = data.precio || 0;
    this.status = data.status || 'inactive'; // active, inactive, cancelled, past_due, trialing
    this.currentPeriodStart = data.currentPeriodStart || null;
    this.currentPeriodEnd = data.currentPeriodEnd || null;
    this.cancelAtPeriodEnd = data.cancelAtPeriodEnd || false;
    this.metadata = data.metadata || {};
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  /**
   * Crear una nueva suscripción
   */
  static async create(subscriptionData) {
    try {
      const subscription = new Subscription(subscriptionData);
      
      const docRef = await db.collection('subscriptions').add({
        userId: subscription.userId,
        stripeSubscriptionId: subscription.stripeSubscriptionId,
        stripePriceId: subscription.stripePriceId,
        plan: subscription.plan,
        descripcion: subscription.descripcion,
        precio: subscription.precio,
        status: subscription.status,
        currentPeriodStart: subscription.currentPeriodStart,
        currentPeriodEnd: subscription.currentPeriodEnd,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        metadata: subscription.metadata,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      subscription.id = docRef.id;
      await docRef.update({ id: docRef.id });
      
      console.log('✅ Suscripción creada:', subscription.id);
      return subscription;
    } catch (error) {
      console.error('Error creando suscripción:', error);
      throw error;
    }
  }

  /**
   * Obtener suscripción por ID
   */
  static async getById(id) {
    try {
      const doc = await db.collection('subscriptions').doc(id).get();
      
      if (!doc.exists) {
        return null;
      }
      
      return new Subscription({ id: doc.id, ...doc.data() });
    } catch (error) {
      console.error('Error obteniendo suscripción:', error);
      throw error;
    }
  }

  /**
   * Obtener suscripciones de un usuario
   */
  static async getByUserId(userId) {
    try {
      const snapshot = await db.collection('subscriptions')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();
      
      return snapshot.docs.map(doc => new Subscription({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error obteniendo suscripciones del usuario:', error);
      throw error;
    }
  }

  /**
   * Obtener suscripción activa de un usuario
   */
  static async getActiveByUserId(userId) {
    try {
      const snapshot = await db.collection('subscriptions')
        .where('userId', '==', userId)
        .where('status', '==', 'active')
        .limit(1)
        .get();
      
      if (snapshot.empty) {
        return null;
      }
      
      const doc = snapshot.docs[0];
      return new Subscription({ id: doc.id, ...doc.data() });
    } catch (error) {
      console.error('Error obteniendo suscripción activa:', error);
      throw error;
    }
  }

  /**
   * Obtener suscripción por Stripe Subscription ID
   */
  static async getByStripeSubscriptionId(stripeSubscriptionId) {
    try {
      const snapshot = await db.collection('subscriptions')
        .where('stripeSubscriptionId', '==', stripeSubscriptionId)
        .limit(1)
        .get();
      
      if (snapshot.empty) {
        return null;
      }
      
      const doc = snapshot.docs[0];
      return new Subscription({ id: doc.id, ...doc.data() });
    } catch (error) {
      console.error('Error obteniendo suscripción por Stripe ID:', error);
      throw error;
    }
  }

  /**
   * Actualizar suscripción
   */
  static async update(id, updateData) {
    try {
      const docRef = db.collection('subscriptions').doc(id);
      
      await docRef.update({
        ...updateData,
        updatedAt: new Date()
      });
      
      console.log('✅ Suscripción actualizada:', id);
      return await Subscription.getById(id);
    } catch (error) {
      console.error('Error actualizando suscripción:', error);
      throw error;
    }
  }

  /**
   * Cancelar suscripción
   */
  static async cancel(id, cancelAtPeriodEnd = true) {
    try {
      const updateData = {
        cancelAtPeriodEnd,
        updatedAt: new Date()
      };
      
      if (!cancelAtPeriodEnd) {
        updateData.status = 'cancelled';
      }
      
      await db.collection('subscriptions').doc(id).update(updateData);
      console.log('✅ Suscripción cancelada:', id);
      return await Subscription.getById(id);
    } catch (error) {
      console.error('Error cancelando suscripción:', error);
      throw error;
    }
  }

  /**
   * Eliminar suscripción
   */
  static async delete(id) {
    try {
      await db.collection('subscriptions').doc(id).delete();
      console.log('✅ Suscripción eliminada:', id);
      return true;
    } catch (error) {
      console.error('Error eliminando suscripción:', error);
      throw error;
    }
  }

  /**
   * Listar todas las suscripciones activas
   */
  static async listActive(limit = 50) {
    try {
      const snapshot = await db.collection('subscriptions')
        .where('status', '==', 'active')
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();
      
      return snapshot.docs.map(doc => new Subscription({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error listando suscripciones activas:', error);
      throw error;
    }
  }
}

module.exports = Subscription;
