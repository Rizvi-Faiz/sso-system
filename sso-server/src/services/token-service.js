const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

class TokenService {
  generateTokens(userId, email) {
    const accessToken = jwt.sign(
      { userId, email },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    
    const refreshToken = jwt.sign(
      { userId, email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    return { accessToken, refreshToken };
  }
  
  validateToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return null;
    }
  }
}

module.exports = new TokenService();