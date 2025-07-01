const request = require('supertest');
const app = require('../../src/app');
const sequelize = require('../../src/database');
const logger = require('../../src/utils/logger');

jest.mock('../../src/utils/logger');

describe('Health Check', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return status ok and database up', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok', database: 'up' });
    expect(logger.info).toHaveBeenCalledWith({ msg: 'Health check passed', status: 'ok', database: 'up' });
  });

  test('should return error if DB is down', async () => {
    jest.spyOn(sequelize, 'authenticate').mockRejectedValue(new Error('DB down'));

    const res = await request(app).get('/health');
    expect(res.status).toBe(500);
    expect(res.body).toMatchObject({ status: 'error', database: 'down' });
    expect(logger.error).toHaveBeenCalledWith(expect.objectContaining({ msg: 'Health check failed' }));

    sequelize.authenticate.mockRestore();
  });
});
