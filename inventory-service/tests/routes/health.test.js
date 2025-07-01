const request = require('supertest');
const express = require('express');
const healthRouter = require('../../src/routes/health.routes');
const logger = require('../../src/utils/logger');

jest.mock('../../src/utils/logger');

describe('Health Check', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use('/health', healthRouter);
  });

  test('should return status ok and log the health check', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
    expect(logger.info).toHaveBeenCalledWith({ msg: 'Health check passed', status: 'ok' });
  });
});
