const jwt = require('jsonwebtoken');

const jwt_secret_key = process.env.JWT_SECRET ||  'stockflow_jwt_secret_key_default';

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

    const decoded = jwt.verify(token, jwt_secret_key);

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
