const errorHandler = require('../../src/middlewares/errorHandler');
const logger = require('../../src/utils/logger');

jest.mock('../../src/utils/logger');

describe('errorHandler middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      method: 'GET',
      originalUrl: '/test-route',
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  test('should handle errors with status and message', () => {
    const err = { status: 404, message: 'Not Found' };

    errorHandler(err, req, res, next);

    expect(logger.error).toHaveBeenCalledWith(expect.objectContaining({
      msg: 'Unhandled error',
      method: 'GET',
      url: '/test-route',
      status: 404,
      error: 'Not Found',
    }));

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      errors: [{ status: 404, detail: 'Not Found' }],
    });
  });

  test('should handle errors without status or message', () => {
    const err = {};

    errorHandler(err, req, res, next);

    expect(logger.error).toHaveBeenCalledWith(expect.objectContaining({
      msg: 'Unhandled error',
      method: 'GET',
      url: '/test-route',
      status: 500,
      error: undefined,
    }));

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      errors: [{ status: 500, detail: 'Internal Server Error' }],
    });
  });
});
