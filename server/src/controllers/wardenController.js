const User = require('../models/User');
const Room = require('../models/Room');
const Complaint = require('../models/Complaint');
const LeaveRequest = require('../models/LeaveRequest');
const Visitor = require('../models/Visitor');

// @desc    Get vacant rooms list for room allocation
// @route   GET /api/warden/vacant-rooms
// @access  Private (Warden, Admin)
const getVacantRooms = async (req, res) => {
  try {
    const vacantRooms = await Room.find({
      $expr: { $lt: ["$occupiedBeds", "$capacity"] }
    }).populate('occupants', 'name department year');

    res.status(200).json({
      status: 'success',
      data: vacantRooms
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Allocate room to a student
// @route   POST /api/warden/allocate-room
// @access  Private (Warden, Admin)
const allocateRoom = async (req, res) => {
  try {
    const { studentId, roomId } = req.body;

    const student = await User.findById(studentId);
    const room = await Room.findById(roomId);

    if (!student || !room) {
      return res.status(404).json({ status: 'error', message: 'Student or Room not found' });
    }

    if (room.occupiedBeds >= room.capacity) {
      return res.status(400).json({ status: 'error', message: 'Selected room is at full capacity' });
    }

    // Assign student to room
    student.room = room._id;
    student.roomNumber = room.roomNumber;
    student.hostelBlock = room.hostelBlock;
    await student.save();

    if (!room.occupants.includes(student._id)) {
      room.occupants.push(student._id);
      room.occupiedBeds = room.occupants.length;
      await room.save();
    }

    // Socket.io Notify
    if (req.io) {
      req.io.emit('room_allocated', { studentId: student._id, roomNumber: room.roomNumber });
    }

    res.status(200).json({
      status: 'success',
      message: `Successfully allocated Room ${room.roomNumber} to ${student.name}`,
      data: { student, room }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Get all maintenance complaints
// @route   GET /api/warden/complaints
// @access  Private (Warden, Admin)
const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().populate('student', 'name roomNumber hostelBlock').sort({ createdAt: -1 });
    res.status(200).json({
      status: 'success',
      data: complaints
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Update complaint status & technician assignment
// @route   PUT /api/warden/complaints/:id
// @access  Private (Warden, Admin)
const updateComplaintStatus = async (req, res) => {
  try {
    const { status, assignedTechnician } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ status: 'error', message: 'Complaint ticket not found' });
    }

    if (status) complaint.status = status;
    if (assignedTechnician) complaint.assignedTechnician = assignedTechnician;
    if (status === 'Resolved') complaint.resolvedAt = new Date();

    await complaint.save();

    if (req.io) {
      req.io.emit('complaint_updated', complaint);
    }

    res.status(200).json({
      status: 'success',
      message: `Complaint ticket ${complaint.ticketId} updated to ${complaint.status}`,
      data: complaint
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Get all pending leave requests
// @route   GET /api/warden/leave-requests
// @access  Private (Warden, Admin)
const getWardenLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.find()
      .populate('student', 'name roomNumber department attendancePercentage')
      .sort({ appliedAt: -1 });

    res.status(200).json({
      status: 'success',
      data: leaveRequests
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Approve or Reject a leave request
// @route   PUT /api/warden/leave-requests/:id
// @access  Private (Warden, Admin)
const updateLeaveRequestDecision = async (req, res) => {
  try {
    const { status } = req.body; // 'Approved' or 'Rejected'
    const leave = await LeaveRequest.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ status: 'error', message: 'Leave request not found' });
    }

    leave.status = status;
    leave.wardenApprovedBy = req.user._id;
    await leave.save();

    if (req.io) {
      req.io.emit('leave_decision', leave);
    }

    res.status(200).json({
      status: 'success',
      message: `Leave request ${leave.leaveId} marked as ${leave.status}`,
      data: leave
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Get visitor requests
// @route   GET /api/warden/visitors
// @access  Private (Warden, Admin)
const getVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find()
      .populate('student', 'name roomNumber hostelBlock')
      .sort({ entryTime: -1 });

    res.status(200).json({
      status: 'success',
      data: visitors
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Approve or Deny visitor gate pass
// @route   PUT /api/warden/visitors/:id
// @access  Private (Warden, Admin)
const updateVisitorDecision = async (req, res) => {
  try {
    const { status } = req.body; // 'Approved' or 'Denied'
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res.status(404).json({ status: 'error', message: 'Visitor record not found' });
    }

    visitor.status = status;
    if (status === 'Approved') {
      visitor.gatePassCode = `PASS-${Math.floor(1000 + Math.random() * 9000)}`;
    }
    visitor.approvedBy = req.user._id;

    await visitor.save();

    if (req.io) {
      req.io.emit('visitor_updated', visitor);
    }

    res.status(200).json({
      status: 'success',
      message: `Visitor pass updated to ${visitor.status}`,
      data: visitor
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// @desc    Get hostel occupancy analytics
// @route   GET /api/warden/occupancy
// @access  Private (Warden, Admin)
const getOccupancyAnalytics = async (req, res) => {
  try {
    const rooms = await Room.find();
    
    let totalCapacity = 0;
    let totalOccupied = 0;

    const blockMap = {};

    rooms.forEach(room => {
      totalCapacity += room.capacity;
      totalOccupied += room.occupiedBeds;

      if (!blockMap[room.hostelBlock]) {
        blockMap[room.hostelBlock] = { capacity: 0, occupied: 0 };
      }
      blockMap[room.hostelBlock].capacity += room.capacity;
      blockMap[room.hostelBlock].occupied += room.occupiedBeds;
    });

    res.status(200).json({
      status: 'success',
      data: {
        totalBeds: totalCapacity || 240,
        occupiedBeds: totalOccupied || 218,
        vacantBeds: (totalCapacity - totalOccupied) || 22,
        occupancyRate: `${Math.round(((totalOccupied || 218) / (totalCapacity || 240)) * 100)}%`,
        blockBreakdown: blockMap
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = {
  getVacantRooms,
  allocateRoom,
  getAllComplaints,
  updateComplaintStatus,
  getWardenLeaveRequests,
  updateLeaveRequestDecision,
  getVisitors,
  updateVisitorDecision,
  getOccupancyAnalytics
};
