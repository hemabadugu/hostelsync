const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Public Auth Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected Profile Route
router.get('/me', protect, getMe);

// Role Test Routes
router.get('/warden-only', protect, authorizeRoles('warden', 'admin'), (req, res) => {
  res.status(200).json({
    status: 'success',
    message: `Access granted to Warden Portal API (User: ${req.user.name})`
  });
});

module.exports = router;
