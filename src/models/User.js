const { db } = require('../config/firebase');

/**
 * Modelo de Usuario para Firestore
 */
class User {
  constructor(data) {
    this.uid = data.uid || null;
    this.email = data.email;
    this.name = data.name || null;
    this.company = data.company || null;
    this.estado = data.estado || 'active'; // active, inactive, suspended
    this.stripeCustomerId = data.stripeCustomerId || null;
    this.role = data.role || 'user'; // user, premium, admin
    this.photoURL = data.photoURL || null;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  /**
   * Crear un nuevo usuario en Firestore
   */
  static async create(userData) {
    try {
      const user = new User(userData);
      // Si no se proporciona uid, crear un documento con ID automático
      let docRef;
      if (user.uid) {
        docRef = db.collection('users').doc(user.uid);
      } else {
        docRef = db.collection('users').doc();
        user.uid = docRef.id; // asignar el id generado
      }

      await docRef.set({
        uid: user.uid,
        email: user.email,
        name: user.name,
        company: user.company,
        estado: user.estado,
        stripeCustomerId: user.stripeCustomerId,
        role: user.role,
        photoURL: user.photoURL,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log('✅ Usuario creado:', user.uid);
      return user;
    } catch (error) {
      console.error('Error creando usuario:', error);
      throw error;
    }
  }

  /**
   * Obtener usuario por UID
   */
  static async getByUid(uid) {
    try {
      const doc = await db.collection('users').doc(uid).get();
      
      if (!doc.exists) {
        return null;
      }
      
      return new User({ uid: doc.id, ...doc.data() });
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      throw error;
    }
  }

  /**
   * Obtener usuario por email
   */
  static async getByEmail(email) {
    try {
      const snapshot = await db.collection('users')
        .where('email', '==', email)
        .limit(1)
        .get();
      
      if (snapshot.empty) {
        return null;
      }
      
      const doc = snapshot.docs[0];
      return new User({ uid: doc.id, ...doc.data() });
    } catch (error) {
      console.error('Error obteniendo usuario por email:', error);
      throw error;
    }
  }

  /**
   * Obtener usuario por Stripe Customer ID
   */
  static async getByStripeCustomerId(stripeCustomerId) {
    try {
      const snapshot = await db.collection('users')
        .where('stripeCustomerId', '==', stripeCustomerId)
        .limit(1)
        .get();
      
      if (snapshot.empty) {
        return null;
      }
      
      const doc = snapshot.docs[0];
      return new User({ uid: doc.id, ...doc.data() });
    } catch (error) {
      console.error('Error obteniendo usuario por Stripe ID:', error);
      throw error;
    }
  }

  /**
   * Actualizar usuario
   */
  static async update(uid, updateData) {
    try {
      const docRef = db.collection('users').doc(uid);
      
      await docRef.update({
        ...updateData,
        updatedAt: new Date()
      });
      
      console.log('✅ Usuario actualizado:', uid);
      return await User.getByUid(uid);
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      throw error;
    }
  }

  /**
   * Eliminar usuario
   */
  static async delete(uid) {
    try {
      await db.collection('users').doc(uid).delete();
      console.log('✅ Usuario eliminado:', uid);
      return true;
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      throw error;
    }
  }

  /**
   * Listar todos los usuarios con paginación
   */
  static async list(limit = 10, startAfter = null) {
    try {
      let query = db.collection('users')
        .orderBy('createdAt', 'desc')
        .limit(limit);
      
      if (startAfter) {
        const lastDoc = await db.collection('users').doc(startAfter).get();
        query = query.startAfter(lastDoc);
      }
      
      const snapshot = await query.get();
      return snapshot.docs.map(doc => new User({ uid: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error listando usuarios:', error);
      throw error;
    }
  }

  /**
   * Contar total de usuarios
   */
  static async count() {
    try {
      const snapshot = await db.collection('users').count().get();
      return snapshot.data().count;
    } catch (error) {
      console.error('Error contando usuarios:', error);
      throw error;
    }
  }
}

module.exports = User;
