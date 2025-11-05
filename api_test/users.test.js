const request = require('supertest');

// Mock firebase config to avoid requiring serviceAccountKey.json during tests
jest.mock('../src/config/firebase', () => ({
  db: { collection: jest.fn() },
  auth: {},
  admin: {}
}));

// Mock the User model used by controllers to avoid hitting Firestore
jest.mock('../src/models/User', () => ({
  create: jest.fn(async (data) => ({ uid: data.uid || 'generated-uid', ...data })),
  getByUid: jest.fn(async (uid) => ({ uid, email: 'test@example.com', name: 'Test User' })),
  list: jest.fn(async (limit = 10) => ([{ uid: 'u1', email: 'a@example.com' }])),
  update: jest.fn(async (uid, updateData) => ({ uid, ...updateData })),
  delete: jest.fn(async (uid) => true)
}));

const app = require('../src/app');

describe('Users API (mocked model)', () => {
  test('POST /api/users should create a user', async () => {
    const newUser = { email: 'new@example.com', name: 'Nuevo' };
    const res = await request(app).post('/api/users').send(newUser).expect(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('email', 'new@example.com');
  });

  test('GET /api/users should list users', async () => {
    const res = await request(app).get('/api/users').expect(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('GET /api/users/:uid should return a user', async () => {
    const res = await request(app).get('/api/users/u1').expect(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('uid', 'u1');
  });

  test('PUT /api/users/:uid should update and return user', async () => {
    const res = await request(app).put('/api/users/u1').send({ name: 'Updated' }).expect(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('name', 'Updated');
  });

  test('DELETE /api/users/:uid should delete user', async () => {
    const res = await request(app).delete('/api/users/u1').expect(200);
    expect(res.body.success).toBe(true);
  });
});
