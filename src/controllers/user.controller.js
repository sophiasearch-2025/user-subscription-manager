// Controlador de usuarios
const { db } = require('../config/firebase');

/**
 * Obtener todos los usuarios
 */
async function getAllUsers(req, res) {
  try {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.get();
    
    const users = [];
    snapshot.forEach(doc => {
      users.push({
        id: doc.id,
        ...doc.data()
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
    
    res.json({
      success: true,
      data: {
        id: doc.id,
        ...doc.data()
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
 * Crear un nuevo usuario
 */
async function createUser(req, res) {
  try {
    const userData = req.body;
    const docRef = await db.collection('users').add({
      ...userData,
      createdAt: new Date().toISOString()
    });
    
    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: {
        id: docRef.id,
        ...userData
      }
    });
  } catch (error) {
    console.error('Error creando usuario:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser
};
