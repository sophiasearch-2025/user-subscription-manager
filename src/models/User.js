const { db } = require('../config/firebase');

/**
 * Modelo de Usuario para Firestore
 */
class User {
  constructor(data) {
    this.uid = data.uid || null;
    this.email = data.email;
    this.username = data.username || null;
    this.password = data.password || null; // Se guardará hasheada
    this.name = data.name || null;
    this.company = data.company || null;
    this.estado = data.estado || 'active'; // active, inactive, suspended
    this.stripeCustomerId = data.stripeCustomerId || null;
    this.role = data.role || 'user'; // user, premium, admin
    this.photoURL = data.photoURL || null;
    this.comprobanteUrl = data.comprobanteUrl || null; // URL del comprobante en Firebase Storage (deprecado)
    this.comprobanteBase64 = data.comprobanteBase64 || null; // Comprobante en formato base64 (binario)
    this.comprobanteInfo = data.comprobanteInfo || null; // Info del archivo (filename, mimetype, size)
    this.solicitudAprobada = data.solicitudAprobada !== undefined ? data.solicitudAprobada : false; // Por defecto false
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  /**
   * Crear un nuevo usuario en Firestore
   */
  static async create(userData) {
    try {
      const user = new User(userData);
      const docRef = db.collection('users').doc(user.uid);
      
      await docRef.set({
        uid: user.uid,
        email: user.email,
        username: user.username,
        password: user.password, // Ya debe venir hasheada del controller
        name: user.name,
        company: user.company,
        estado: user.estado,
        stripeCustomerId: user.stripeCustomerId,
        role: user.role,
        photoURL: user.photoURL,
        comprobanteUrl: user.comprobanteUrl,
        comprobanteBase64: user.comprobanteBase64,
        comprobanteInfo: user.comprobanteInfo,
        solicitudAprobada: false, // Siempre inicia en false
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log('✅ Usuario creado (solicitud pendiente):', user.uid);
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
   * Obtener usuario por username
   */
  static async getByUsername(username) {
    try {
      const snapshot = await db.collection('users')
        .where('username', '==', username)
        .limit(1)
        .get();
      
      if (snapshot.empty) {
        return null;
      }
      
      const doc = snapshot.docs[0];
      return new User({ uid: doc.id, ...doc.data() });
    } catch (error) {
      console.error('Error obteniendo usuario por username:', error);
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

  /**
   * Obtener usuarios con solicitudes pendientes
   */
  static async getPendingRequests() {
    try {
      const snapshot = await db.collection('users')
        .where('solicitudAprobada', '==', false)
        .get();
      
      const users = [];
      snapshot.forEach(doc => {
        users.push(new User({ uid: doc.id, ...doc.data() }));
      });
      
      // Ordenar en memoria por fecha de creación
      users.sort((a, b) => {
        const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
        const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
        return dateB - dateA; // Más recientes primero
      });
      
      return users;
    } catch (error) {
      console.error('Error obteniendo solicitudes pendientes:', error);
      throw error;
    }
  }

  /**
   * Obtener usuarios aprobados
   */
  static async getApprovedUsers() {
    try {
      const snapshot = await db.collection('users')
        .where('solicitudAprobada', '==', true)
        .get();
      
      const users = [];
      snapshot.forEach(doc => {
        users.push(new User({ uid: doc.id, ...doc.data() }));
      });
      
      // Ordenar en memoria por fecha de creación
      users.sort((a, b) => {
        const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
        const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
        return dateB - dateA; // Más recientes primero
      });
      
      return users;
    } catch (error) {
      console.error('Error obteniendo usuarios aprobados:', error);
      throw error;
    }
  }
}

module.exports = User;
