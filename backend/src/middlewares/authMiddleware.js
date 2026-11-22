const jwt = require('jsonwebtoken');

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET || process.env.jwt_secret_key;
  if (process.env.NODE_ENV === 'production' && !secret) {
    throw new Error('JWT secret must be configured in production environment');
  }
  return secret || 'stockflow_jwt_secret_key_default';
};

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET && !process.env.jwt_secret_key) {
  throw new Error('JWT secret must be configured in production environment');
}

const jwt_secret_key = process.env.JWT_SECRET || process.env.jwt_secret_key || 'stockflow_jwt_secret_key_default';

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: 'Authorization header missing',
      });
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({
        error: 'Invalid authorization format',
      });
    }

    const secretKey = getJwtSecret();
    const decoded = jwt.verify(token, secretKey);

    req.user = decoded;
    req.organizationId = decoded.organizationId;

    next();
  } catch (err) {
    console.log('Token verification error:', err.message);

    return res.status(401).json({
      error: 'Invalid or expired token',
    });
  }
};

module.exports = verifyToken;
