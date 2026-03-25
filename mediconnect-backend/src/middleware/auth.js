const jwt = require('jsonwebtoken');

const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mediconnect-jwt-super-secret-2026');
      
      req.user = decoded;

      if (roles.length > 0 && !roles.includes(decoded.role)) {
        return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
  };
};

module.exports = authMiddleware;
