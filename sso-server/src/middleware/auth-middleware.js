const tokenService = require('../services/token-service');

module.exports = (req, res, next) => {
  try {
    // Check authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header is required' });
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Access token is required' });
    }
    
    const userData = tokenService.validateToken(token);
    
    if (!userData) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    
    req.user = userData;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
};
