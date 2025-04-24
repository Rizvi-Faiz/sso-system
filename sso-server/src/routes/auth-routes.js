const express = require('express');
const authController = require('../controllers/auth-controller');
const authMiddleware = require('../middleware/auth-middleware');

const router = express.Router();

router.post('/verify-token', authController.verifyFirebaseToken);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);
router.get('/check', authController.checkAuth);

// Protected route example
router.get('/protected', authMiddleware, (req, res) => {
  res.status(200).json({ message: 'You accessed a protected route', user: req.user });
});

module.exports = router;