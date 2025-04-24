const admin = require('../config/firebase-config');
const tokenService = require('../services/token-service');

class AuthController {
  async verifyFirebaseToken(req, res) {
    try {
      const { idToken } = req.body;
      
      if (!idToken) {
        return res.status(400).json({ error: 'Firebase ID token is required' });
      }
      
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const { uid, email } = decodedToken;
      
      // Generate SSO tokens
      const tokens = tokenService.generateTokens(uid, email);
      
      // Store user session
      req.session.user = { userId: uid, email };
      
      // Set refresh token in HTTP-only cookie
      res.cookie('refreshToken', tokens.refreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
      
      return res.status(200).json({
        accessToken: tokens.accessToken,
        user: { userId: uid, email }
      });
    } catch (error) {
      console.error('Auth error:', error);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  }
  
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.cookies;
      
      if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token is required' });
      }
      
      const userData = tokenService.validateToken(refreshToken);
      
      if (!userData) {
        return res.status(401).json({ error: 'Invalid refresh token' });
      }
      
      // Generate new tokens
      const tokens = tokenService.generateTokens(userData.userId, userData.email);
      
      // Update cookie
      res.cookie('refreshToken', tokens.refreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
      
      return res.status(200).json({
        accessToken: tokens.accessToken,
        user: { userId: userData.userId, email: userData.email }
      });
    } catch (error) {
      console.error('Refresh token error:', error);
      return res.status(401).json({ error: 'Failed to refresh token' });
    }
  }
  
  async logout(req, res) {
    try {
      // Clear session
      req.session.destroy();
      
      // Clear cookie
      res.clearCookie('refreshToken');
      
      return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error('Logout error:', error);
      return res.status(500).json({ error: 'Logout failed' });
    }
  }
  
  async checkAuth(req, res) {
    try {
      if (!req.session.user) {
        return res.status(401).json({ authenticated: false });
      }
      
      return res.status(200).json({
        authenticated: true,
        user: req.session.user
      });
    } catch (error) {
      console.error('Check auth error:', error);
      return res.status(500).json({ error: 'Failed to check authentication' });
    }
  }
}

module.exports = new AuthController();