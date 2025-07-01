const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error({
    msg: 'Unhandled error',
    method: req.method,
    url: req.originalUrl,
    status: err.status || 500,
    error: err.message,
    stack: err.stack
  });

  const status = err.status || 500;

  res.status(status).json({
    errors: [
      {
        status,
        detail: err.message || 'Internal Server Error',
      },
    ],
  });
};

module.exports = errorHandler;
