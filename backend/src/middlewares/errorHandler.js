const errorHandler = (err, req, res, next) => {
  console.error(err.stack || err.message);
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      error: err.errors ? err.errors.map((e) => e.message).join(', ') : err.message,
    });
  }
  res.status(err.status || err.statusCode || 500).json({
    error: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;
