const express = require('express');
const router = express.Router();
const { recommendRoom, triageComplaint, evaluateLeave } = require('../controllers/aiController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Room recommendation endpoint (Protected Warden/Admin)
router.post('/recommend-room', protect, authorizeRoles('warden', 'admin'), recommendRoom);

// Complaint triage endpoint (Protected Student/Warden)
router.post('/triage-complaint', protect, triageComplaint);

// Leave evaluation endpoint (Protected Student/Warden)
router.post('/evaluate-leave', protect, evaluateLeave);

module.exports = router;
