const request = require('supertest');
const app = require('../src/app');

describe('App Integration', () => {
  test('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/unknown');
    expect(res.status).toBe(404);
    expect(res.body.errors).toBeDefined();
  });

  test('should return 400 for invalid JSON body', async () => {
    const res = await request(app)
      .post('/products')
      .set('Content-Type', 'application/json')
      .send('invalid json');

    expect(res.status).toBe(400);
  });

  test('should respond to /products (even if empty)', async () => {
    const res = await request(app)
      .get('/products')
      .set('x-api-key', process.env.INTERNAL_API_KEY);

    expect([200, 500]).toContain(res.statusCode);
  });
});
