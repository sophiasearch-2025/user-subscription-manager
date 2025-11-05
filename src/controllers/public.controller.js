const { db } = require('../config/firebase');

/**
 * Obtener usuarios públicos (sanitizados) para visualizaciones externas.
 * Query params:
 *  - limit (number)
 *  - q (string) filtro por email/nombre/compañía
 */
async function getPublicUsers(req, res) {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 500);
    const q = (req.query.q || '').trim().toLowerCase();

    let query = db.collection('users').orderBy('createdAt', 'desc').limit(limit);
    const snapshot = await query.get();

    let users = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));

    if (q) {
      users = users.filter(u => {
        return [u.email, u.name, u.company]
          .filter(Boolean)
          .some(field => field.toLowerCase().includes(q));
      });
    }

    // Sanitizar: exponer solo campos seguros para terceros
    const sanitized = users.map(u => ({
      uid: u.uid,
      email: u.email,
      name: u.name || null,
      company: u.company || null,
      role: u.role || 'user'
    }));

    res.json({ success: true, count: sanitized.length, data: sanitized });
  } catch (error) {
    console.error('Error getPublicUsers:', error);
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  getPublicUsers
};
