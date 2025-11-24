// Controlador de usuarios
const { db } = require('../config/firebase');
const admin = require('firebase-admin');
const User = require('../models/User');
const notificationService = require('../services/notification.service');
const bcrypt = require('bcrypt');

/**
 * Obtener todos los usuarios
 */
async function getAllUsers(req, res) {
  try {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.get();
    
    const users = [];
    snapshot.forEach(doc => {
      const userData = doc.data();
      delete userData.password; // No devolver contraseña
      delete userData.comprobanteBase64; // No devolver binario (muy grande)
      users.push({
        id: doc.id,
        ...userData
      });
    });
    
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

/**
 * Obtener un usuario por ID
 */
async function getUserById(req, res) {
  try {
    const { id } = req.params;
    const docRef = db.collection('users').doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    const userData = doc.data();
    delete userData.password; // No devolver contraseña
    delete userData.comprobanteBase64; // No devolver binario (muy grande)
    
    res.json({
      success: true,
      data: {
        id: doc.id,
        ...userData
      }
    });
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

/**
 * Crear un nuevo usuario con comprobante (solicitud pendiente)
 * POST /api/users
 */
async function createUser(req, res) {
  try {
    const { email, username, password, name, company } = req.body;
    const comprobanteFile = req.file; // Archivo del comprobante

    // Validaciones
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'El email es requerido'
      });
    }

    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'El username es requerido'
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña es requerida'
      });
    }

    if (!comprobanteFile) {
      return res.status(400).json({
        success: false,
        message: 'El comprobante de pago es requerido'
      });
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Verificar si el usuario ya existe (por email)
    const existingUser = await User.getByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    // Verificar si el username ya existe
    const existingUsername = await User.getByUsername(username);
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: 'El username ya está en uso'
      });
    }

    // Generar UID único
    const uid = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Convertir comprobante a base64 (binario) para guardar en Firestore
    let comprobanteBase64 = null;
    let comprobanteInfo = null;
    
    try {
      // Convertir buffer a base64 (representación binaria)
      comprobanteBase64 = comprobanteFile.buffer.toString('base64');
      
      // Guardar info del archivo
      comprobanteInfo = {
        filename: comprobanteFile.originalname,
        mimetype: comprobanteFile.mimetype,
        size: comprobanteFile.size,
        uploadedAt: new Date().toISOString()
      };
      
      console.log('✅ Comprobante convertido a base64 (binario)');
    } catch (error) {
      console.error('❌ Error procesando comprobante:', error);
      return res.status(500).json({
        success: false,
        message: 'Error procesando comprobante',
        error: error.message
      });
    }

    // Hashear la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear usuario con solicitud pendiente
    const userData = {
      uid,
      email,
      username,
      password: hashedPassword,
      name: name || null,
      company: company || null,
      comprobanteBase64: comprobanteBase64,
      comprobanteInfo: comprobanteInfo,
      solicitudAprobada: false // Por defecto false
    };

    const newUser = await User.create(userData);

    console.log('✅ Usuario creado (pendiente de aprobación):', uid);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado con comprobante. Solicitud pendiente de aprobación.',
      data: {
        uid: newUser.uid,
        email: newUser.email,
        username: newUser.username,
        name: newUser.name,
        company: newUser.company,
        comprobanteInfo: comprobanteInfo,
        solicitudAprobada: false
      }
    });

  } catch (error) {
    console.error('Error creando usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error creando usuario',
      error: error.message
    });
  }
}

/**
 * Aprobar solicitud de usuario (Admin)
 * PATCH /api/users/:uid/approve
 */
async function approveUser(req, res) {
  try {
    const { uid } = req.params;

    // Obtener usuario
    const user = await User.getByUid(uid);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Verificar si ya está aprobado
    if (user.solicitudAprobada) {
      return res.status(400).json({
        success: false,
        message: 'El usuario ya está aprobado'
      });
    }

    // Aprobar usuario
    await User.update(uid, {
      solicitudAprobada: true,
      estado: 'active'
    });

    console.log('✅ Usuario aprobado:', uid);

    // Enviar email de bienvenida
    try {
      await notificationService.sendWelcomeNotification(uid, {
        email: user.email,
        name: user.name || user.email.split('@')[0]
      });
      console.log('✅ Email de bienvenida enviado a:', user.email);
    } catch (emailError) {
      console.error('❌ Error enviando email de bienvenida:', emailError.message);
      // No fallar la aprobación si falla el email
    }

    res.json({
      success: true,
      message: 'Usuario aprobado exitosamente. Email de bienvenida enviado.',
      data: {
        uid: user.uid,
        email: user.email,
        solicitudAprobada: true,
        emailSent: true
      }
    });

  } catch (error) {
    console.error('Error aprobando usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error aprobando usuario',
      error: error.message
    });
  }
}

/**
 * Rechazar solicitud de usuario (Admin)
 * PATCH /api/users/:uid/reject
 */
async function rejectUser(req, res) {
  try {
    const { uid } = req.params;
    const { motivo } = req.body;

    // Obtener usuario
    const user = await User.getByUid(uid);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Actualizar estado
    await User.update(uid, {
      estado: 'rejected',
      motivoRechazo: motivo || 'No especificado',
      rechazadoAt: new Date()
    });

    console.log('❌ Usuario rechazado:', uid);

    res.json({
      success: true,
      message: 'Solicitud rechazada',
      data: {
        uid: user.uid,
        estado: 'rejected'
      }
    });

  } catch (error) {
    console.error('Error rechazando usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error rechazando usuario',
      error: error.message
    });
  }
}

/**
 * Obtener usuarios con solicitudes pendientes
 * GET /api/users/pending
 */
async function getPendingUsers(req, res) {
  try {
    const pendingUsers = await User.getPendingRequests();

    // Filtrar contraseñas y base64
    const usersWithoutPassword = pendingUsers.map(user => {
      const userObj = { ...user };
      delete userObj.password;
      delete userObj.comprobanteBase64; // No devolver binario (muy grande)
      return userObj;
    });

    res.json({
      success: true,
      data: usersWithoutPassword,
      count: usersWithoutPassword.length
    });
  } catch (error) {
    console.error('Error obteniendo usuarios pendientes:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo usuarios pendientes',
      error: error.message
    });
  }
}

/**
 * Obtener comprobante de un usuario (como imagen)
 * GET /api/users/:uid/comprobante
 */
async function getComprobante(req, res) {
  try {
    const { uid } = req.params;
    
    const user = await User.getByUid(uid);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    if (!user.comprobanteBase64) {
      return res.status(404).json({
        success: false,
        message: 'Este usuario no tiene comprobante'
      });
    }
    
    // Convertir base64 a buffer
    const imageBuffer = Buffer.from(user.comprobanteBase64, 'base64');
    
    // Enviar imagen
    res.set('Content-Type', user.comprobanteInfo?.mimetype || 'image/png');
    res.set('Content-Disposition', `inline; filename="${user.comprobanteInfo?.filename || 'comprobante.png'}"`);
    res.send(imageBuffer);
    
  } catch (error) {
    console.error('Error obteniendo comprobante:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo comprobante',
      error: error.message
    });
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  approveUser,
  rejectUser,
  getPendingUsers,
  getComprobante
};
