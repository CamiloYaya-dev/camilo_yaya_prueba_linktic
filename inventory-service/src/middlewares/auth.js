const logger = require('../utils/logger');

module.exports = function apiKeyAuth(req, res, next) {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || apiKey !== process.env.INTERNAL_API_KEY) {
    logger.warn({
      msg: 'Unauthorized access attempt',
      method: req.method,
      url: req.originalUrl,
      providedApiKey: apiKey
    });

    return res.status(401).json({
      errors: [{ status: 401, detail: 'Unauthorized: Invalid API Key' }]
    });
  }

  logger.info({
    msg: 'Authorized internal request',
    method: req.method,
    url: req.originalUrl
  });

  next();
};
