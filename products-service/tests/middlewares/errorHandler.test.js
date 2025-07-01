const errorHandler = require('../../src/middlewares/errorHandler');

describe('errorHandler middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should handle errors with status and message', () => {
    const err = { status: 404, message: 'Not Found' };

    errorHandler(err, req, res, next);

    expect(console.error).toHaveBeenCalledWith('[ERROR]', 'Not Found');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      errors: [{ status: 404, detail: 'Not Found' }],
    });
  });

  test('should handle errors without status or message', () => {
    const err = {};

    errorHandler(err, req, res, next);

    expect(console.error).toHaveBeenCalledWith('[ERROR]', undefined);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      errors: [{ status: 500, detail: 'Internal Server Error' }],
    });
  });
});
