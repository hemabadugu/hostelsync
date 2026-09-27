const express = require('express');
const router = express.Router();
const {
  getStudentRoomDetails,
  getStudentFees,
  getStudentAttendance,
  getStudentComplaints,
  createStudentComplaint,
  getStudentLeaveRequests,
  createStudentLeaveRequest
} = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');

// All Student routes require protect middleware
router.use(protect);

router.get('/room', getStudentRoomDetails);
router.get('/fees', getStudentFees);
router.get('/attendance', getStudentAttendance);
router.route('/complaints')
  .get(getStudentComplaints)
  .post(createStudentComplaint);

router.route('/leave')
  .get(getStudentLeaveRequests)
  .post(createStudentLeaveRequest);

module.exports = router;
