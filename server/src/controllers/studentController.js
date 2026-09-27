const User = require('../models/User');
const Room = require('../models/Room');
const Complaint = require('../models/Complaint');
const LeaveRequest = require('../models/LeaveRequest');
const Payment = require('../models/Payment');

// @desc    Get logged in student's room & roommate details
// @route   GET /api/student/room
// @access  Private (Student)
const getStudentRoomDetails = async (req, res) => {
  try {
    const student = await User.findById(req.user._id).populate('room');

    if (!student || !student.room) {
      // Fallback mock structure if no DB room linked yet
      return res.status(200).json({
        status: 'success',
        data: {
          roomNumber: student.roomNumber || 'B-204',
          hostelBlock: student.hostelBlock || 'Block B (Aryabhata)',
          floor: 2,
          bedAssigned: 'Bed #02 (Window Side)',
          facilities: ['Air Conditioner', 'High-Speed Wi-Fi', 'Study Desk', 'Attached Balcony'],
          roommates: [
            { name: 'Vikram Sharma', department: 'Computer Science & Engg', year: 'Year 3', match: '95%' }
          ],
          warden: { name: 'Dr. R. K. Verma', phone: '+91-9876543210', officeHours: '04:00 PM - 07:00 PM' }
        }
      });
    }

    // Find roommates in same room
    const roommates = await User.find({
      room: student.room._id,
      _id: { $ne: student._id }
    }).select('name department year phone');

    res.status(200).json({
      status: 'success',
      data: {
        roomNumber: student.room.roomNumber,
        hostelBlock: student.room.hostelBlock,
        floor: student.room.floor,
        capacity: student.room.capacity,
        facilities: student.room.facilities,
        roommates,
        warden: { name: 'Dr. R. K. Verma', phone: '+91-9876543210', officeHours: '04:00 PM - 07:00 PM' }
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Get student fee breakdown & transaction history
// @route   GET /api/student/fees
// @access  Private (Student)
const getStudentFees = async (req, res) => {
  try {
    const payments = await Payment.find({ student: req.user._id }).sort({ paidAt: -1 });

    const totalPaid = payments
      .filter(p => p.status === 'SUCCESS')
      .reduce((acc, curr) => acc + curr.amount, 0);

    res.status(200).json({
      status: 'success',
      data: {
        totalSemesterDues: 65000,
        amountPaid: totalPaid || 65000,
        status: totalPaid >= 65000 ? 'PAID' : 'PENDING',
        feeBreakdown: [
          { title: 'Hostel Room Rent (Double AC)', amount: 35000, status: 'PAID' },
          { title: 'Mess Advance Fee', amount: 22000, status: 'PAID' },
          { title: 'Caution Deposit (Refundable)', amount: 5000, status: 'PAID' },
          { title: 'Amenities & Wi-Fi Charge', amount: 3000, status: 'PAID' }
        ],
        paymentHistory: payments
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Get student attendance score & gate logs
// @route   GET /api/student/attendance
// @access  Private (Student)
const getStudentAttendance = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      status: 'success',
      data: {
        attendancePercentage: user.attendancePercentage || 88.5,
        status: user.attendancePercentage >= 75 ? 'Good Standing' : 'Low Attendance Alert',
        gateLogs: [
          { date: '2026-09-24', checkIn: '09:42 PM', status: 'In Hostel (Before Curfew)' },
          { date: '2026-09-23', checkIn: '09:15 PM', status: 'In Hostel (Before Curfew)' },
          { date: '2026-09-22', checkIn: '09:50 PM', status: 'In Hostel (Before Curfew)' }
        ]
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Get student complaints
// @route   GET /api/student/complaints
// @access  Private (Student)
const getStudentComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ student: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      status: 'success',
      data: complaints
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Create a new student complaint ticket
// @route   POST /api/student/complaints
// @access  Private (Student)
const createStudentComplaint = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;

    const ticketId = `CMP-2026-${Math.floor(100 + Math.random() * 900)}`;
    const textLower = (title + ' ' + (description || '')).toLowerCase();

    // Simple AI Rule-Based Triage
    let detectedCategory = category || 'General';
    let detectedPriority = priority || 'MEDIUM';
    let slaHours = 24;

    if (textLower.includes('leak') || textLower.includes('water') || textLower.includes('pipe')) {
      detectedCategory = 'Plumbing';
      detectedPriority = 'HIGH';
      slaHours = 24;
    } else if (textLower.includes('fan') || textLower.includes('light') || textLower.includes('power')) {
      detectedCategory = 'Electrical';
      detectedPriority = 'HIGH';
      slaHours = 12;
    } else if (textLower.includes('wifi') || textLower.includes('net') || textLower.includes('internet')) {
      detectedCategory = 'Network';
      detectedPriority = 'MEDIUM';
      slaHours = 48;
    }

    const complaint = await Complaint.create({
      ticketId,
      student: req.user._id,
      title,
      description: description || title,
      category: detectedCategory,
      priority: detectedPriority,
      slaHours,
      assignedTechnician: `${detectedCategory} Maintenance Team`,
      aiTriageReason: `Auto-triaged by Complaint Agent (${detectedPriority} Priority, SLA: ${slaHours}h)`
    });

    // Notify Warden via Socket.io
    if (req.io) {
      req.io.emit('new_complaint', complaint);
    }

    res.status(201).json({
      status: 'success',
      data: complaint
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Get student leave requests
// @route   GET /api/student/leave
// @access  Private (Student)
const getStudentLeaveRequests = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ student: req.user._id }).sort({ appliedAt: -1 });
    res.status(200).json({
      status: 'success',
      data: leaves
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Create a new leave request
// @route   POST /api/student/leave
// @access  Private (Student)
const createStudentLeaveRequest = async (req, res) => {
  try {
    const { reason, fromDate, toDate } = req.body;
    const leaveId = `LVE-${Math.floor(800 + Math.random() * 100)}`;

    const user = await User.findById(req.user._id);
    const attendance = user ? user.attendancePercentage : 88.5;

    // AI Attendance Recommendation Check
    const aiRecommendation = attendance >= 75 ? 'APPROVE' : 'REJECT';
    const aiReasoning = attendance >= 75
      ? `Student attendance (${attendance}%) meets 75% cutoff requirement.`
      : `Student attendance (${attendance}%) is below requirement. Warden review required.`;

    const leave = await LeaveRequest.create({
      leaveId,
      student: req.user._id,
      reason,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      aiRecommendation,
      aiConfidence: 0.92,
      aiReasoning
    });

    // Socket.io Notify
    if (req.io) {
      req.io.emit('new_leave_request', leave);
    }

    res.status(201).json({
      status: 'success',
      data: leave
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = {
  getStudentRoomDetails,
  getStudentFees,
  getStudentAttendance,
  getStudentComplaints,
  createStudentComplaint,
  getStudentLeaveRequests,
  createStudentLeaveRequest
};
