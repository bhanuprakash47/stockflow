const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
  const secret = process.env.JWT_SECRET || 'stockflow_jwt_secret_key_default';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign(payload, secret, { expiresIn });
};

const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET || 'stockflow_jwt_secret_key_default';
  return jwt.verify(token, secret);
};

module.exports = {
  generateToken,
  verifyToken,
};
