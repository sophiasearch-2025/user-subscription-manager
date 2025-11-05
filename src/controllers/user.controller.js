const User = require('../models/User');

/**
 * Crear un nuevo usuario
 */
async function createUser(req, res) {
  try {
    const { uid, email, name, company, role, photoURL } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email es requerido' });
    }

    const userData = { uid, email, name, company, role, photoURL };
    const user = await User.create(userData);

    res.status(201).json({ success: true, message: 'Usuario creado', data: user });
  } catch (error) {
    console.error('Error en createUser:', error);
    res.status(500).json({ success: false, message: 'Error creando usuario', error: error.message });
  }
}

/**
 * Obtener usuario por UID
 */
async function getUserByUid(req, res) {
  try {
    const { uid } = req.params;
    const user = await User.getByUid(uid);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Error en getUserByUid:', error);
    res.status(500).json({ success: false, message: 'Error obteniendo usuario', error: error.message });
  }
}

/**
 * Listar usuarios con paginación opcional
 */
async function listUsers(req, res) {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const startAfter = req.query.startAfter || null;

    const users = await User.list(limit, startAfter);
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Error en listUsers:', error);
    res.status(500).json({ success: false, message: 'Error listando usuarios', error: error.message });
  }
}

/**
 * Actualizar usuario
 */
async function updateUser(req, res) {
  try {
    const { uid } = req.params;
    const updateData = req.body;

    const updated = await User.update(uid, updateData);
    res.json({ success: true, message: 'Usuario actualizado', data: updated });
  } catch (error) {
    console.error('Error en updateUser:', error);
    res.status(500).json({ success: false, message: 'Error actualizando usuario', error: error.message });
  }
}

/**
 * Eliminar usuario
 */
async function deleteUser(req, res) {
  try {
    const { uid } = req.params;
    await User.delete(uid);
    res.json({ success: true, message: 'Usuario eliminado' });
  } catch (error) {
    console.error('Error en deleteUser:', error);
    res.status(500).json({ success: false, message: 'Error eliminando usuario', error: error.message });
  }
}

module.exports = {
  createUser,
  getUserByUid,
  listUsers,
  updateUser,
  deleteUser
};
// TODO: Implementar controlador de usuarios
