const request = require('supertest');
const express = require('express');
const healthRouter = require('../../src/routes/health.routes');
const logger = require('../../src/utils/logger');
const sequelize = require('../../src/database');

jest.mock('../../src/utils/logger');

describe('Health Check', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use('/health', healthRouter);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should return status ok and log the health check', async () => {
    jest.spyOn(sequelize, 'authenticate').mockResolvedValue(); // Mock éxito

    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      status: 'ok',
      database: 'up'
    });
    expect(logger.info).toHaveBeenCalledWith(
      expect.objectContaining({ msg: 'Health check passed', database: 'up', status: 'ok' })
    );
  });

  test('should return 500 when DB connection fails', async () => {
    const fakeError = new Error('Connection timeout');
    jest.spyOn(sequelize, 'authenticate').mockRejectedValue(fakeError);

    const res = await request(app).get('/health');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      status: 'error',
      database: 'down',
      message: 'Connection timeout'
    });
    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        msg: 'Health check failed',
        status: 'error',
        database: 'down',
        error: 'Connection timeout'
      })
    );
  });
});
