const express = require('express');
const router = express.Router();
const {
  getVacantRooms,
  allocateRoom,
  getAllComplaints,
  updateComplaintStatus,
  getWardenLeaveRequests,
  updateLeaveRequestDecision,
  getVisitors,
  updateVisitorDecision,
  getOccupancyAnalytics
} = require('../controllers/wardenController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Protect and authorize Warden / Admin roles only
router.use(protect);
router.use(authorizeRoles('warden', 'admin'));

router.get('/vacant-rooms', getVacantRooms);
router.post('/allocate-room', allocateRoom);

router.get('/complaints', getAllComplaints);
router.put('/complaints/:id', updateComplaintStatus);

router.get('/leave-requests', getWardenLeaveRequests);
router.put('/leave-requests/:id', updateLeaveRequestDecision);

router.get('/visitors', getVisitors);
router.put('/visitors/:id', updateVisitorDecision);

router.get('/occupancy', getOccupancyAnalytics);

module.exports = router;
