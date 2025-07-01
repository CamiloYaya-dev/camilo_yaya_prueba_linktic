const errorHandler = (err, req, res, next) => {
  console.error('[ERROR]', err.message);

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
