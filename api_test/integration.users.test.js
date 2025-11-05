const request = require('supertest');

// Ejecutar estos tests solo si se definió la variable de entorno USE_REAL_FIREBASE
const describeIfReal = process.env.USE_REAL_FIREBASE === 'true' ? describe : describe.skip;

const app = require('../src/app');
const { db } = require('../src/config/firebase');

describeIfReal('Integration tests with real Firestore', () => {
  let createdUid = null;

  test('Create -> Read -> Delete user in Firestore via API', async () => {
    const now = Date.now();
    const email = `GiorgioCarlin@gmail.com`;

    // Crear usuario
    const resCreate = await request(app)
      .post('/api/users')
      .send({ email, name: 'Integration Test' })
      .expect(201);

    expect(resCreate.body.success).toBe(true);
    expect(resCreate.body.data).toHaveProperty('email', email);

    createdUid = resCreate.body.data.uid;
    expect(createdUid).toBeDefined();

    // Leer desde API
    const resGet = await request(app).get(`/api/users/${createdUid}`).expect(200);
    expect(resGet.body.success).toBe(true);
    expect(resGet.body.data).toHaveProperty('email', email);

    // Verificar directamente en Firestore
    const doc = await db.collection('users').doc(createdUid).get();
    expect(doc.exists).toBe(true);
    const data = doc.data();
    expect(data.email).toBe(email);

    

    
  }, 20000);
});
