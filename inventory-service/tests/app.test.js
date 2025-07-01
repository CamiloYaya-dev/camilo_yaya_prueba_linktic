const request = require('supertest');
const app = require('../src/app');
const logger = require('../src/utils/logger');

jest.mock('../src/utils/logger');

describe('App Integration', () => {
  test('should respond to /inventory/unknown with 400 for invalid productId', async () => {
    const res = await request(app)
    .get('/inventory/unknown')
    .set('x-api-key', process.env.INTERNAL_API_KEY);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors[0].detail).toBe('Invalid product ID');
    expect(logger.error).toHaveBeenCalledWith(expect.objectContaining({
        msg: 'Error retrieving inventory',
        error: 'Invalid product ID',
    }));
  });


  test('should respond to /health with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
    expect(logger.info).toHaveBeenCalledWith({ msg: 'Health check passed', status: 'ok' });
  });

  test('should return 404 for unknown route', async () => {
    const res = await request(app).get('/unknown');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      errors: [
        {
          status: 404,
          detail: 'Route not found',
        },
      ],
    });
    expect(logger.error).toHaveBeenCalledWith(expect.objectContaining({
      msg: 'Unhandled error',
      status: 404,
      error: 'Route not found'
    }));
  });
});
