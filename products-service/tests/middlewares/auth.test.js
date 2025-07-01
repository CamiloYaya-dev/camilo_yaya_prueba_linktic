const authMiddleware = require('../../src/middlewares/auth');
const logger = require('../../src/utils/logger');

jest.mock('../../src/utils/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
}));

describe('auth middleware', () => {
  const next = jest.fn();
  let req, res;

  beforeEach(() => {
    process.env.INTERNAL_API_KEY = 'valid-key';
    req = {
      headers: {},
      method: 'GET',
      originalUrl: '/test',
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next.mockClear();
    logger.info.mockClear();
    logger.warn.mockClear();
  });

  test('should call next() if API key is valid', () => {
    req.headers['x-api-key'] = 'valid-key';

    authMiddleware(req, res, next);

    expect(logger.info).toHaveBeenCalledWith({
      msg: 'Authorized internal request',
      method: 'GET',
      url: '/test',
    });
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('should respond with 401 if API key is missing', () => {
    authMiddleware(req, res, next);

    expect(logger.warn).toHaveBeenCalledWith(expect.objectContaining({
      msg: 'Unauthorized access attempt',
      method: 'GET',
      url: '/test',
      providedApiKey: undefined,
    }));
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      errors: [{ status: 401, detail: 'Unauthorized: Invalid API Key' }],
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should respond with 401 if API key is invalid', () => {
    req.headers['x-api-key'] = 'wrong-key';

    authMiddleware(req, res, next);

    expect(logger.warn).toHaveBeenCalledWith(expect.objectContaining({
      msg: 'Unauthorized access attempt',
      method: 'GET',
      url: '/test',
      providedApiKey: 'wrong-key',
    }));
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      errors: [{ status: 401, detail: 'Unauthorized: Invalid API Key' }],
    });
    expect(next).not.toHaveBeenCalled();
  });
});
