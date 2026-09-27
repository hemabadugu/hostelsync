const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Room = require('./models/Room');
const Complaint = require('./models/Complaint');
const LeaveRequest = require('./models/LeaveRequest');
const Payment = require('./models/Payment');
const Visitor = require('./models/Visitor');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hostelsync';
    await mongoose.connect(mongoUri);
    console.log('🍃 Connected to MongoDB for Seeding...');

    // Clear existing collections
    await Promise.all([
      User.deleteMany({}),
      Room.deleteMany({}),
      Complaint.deleteMany({}),
      LeaveRequest.deleteMany({}),
      Payment.deleteMany({}),
      Visitor.deleteMany({})
    ]);
    console.log('🧹 Existing collections cleared.');

    // 1. Create Rooms
    const roomB204 = await Room.create({
      roomNumber: 'B-204',
      hostelBlock: 'Block B (Aryabhata)',
      floor: 2,
      capacity: 2,
      occupiedBeds: 2,
      facilities: ['Air Conditioner', 'Wi-Fi', 'Study Desk', 'Attached Balcony']
    });

    const roomA102 = await Room.create({
      roomNumber: 'A-102',
      hostelBlock: 'Block A (Aryabhata)',
      floor: 1,
      capacity: 2,
      occupiedBeds: 1,
      facilities: ['Wi-Fi', 'Study Desk']
    });

    // Hash default password
    const hashedPassword = await bcrypt.hash('password123', 10);

    // 2. Create Users
    const studentAarav = await User.create({
      name: 'Aarav Sharma',
      email: 'student@hostelsync.edu',
      password: hashedPassword,
      role: 'student',
      hostelBlock: 'Block B (Aryabhata)',
      roomNumber: 'B-204',
      room: roomB204._id,
      department: 'Computer Science & Engg',
      year: 'Year 3',
      attendancePercentage: 88.5
    });

    const studentVikram = await User.create({
      name: 'Vikram Sharma',
      email: 'vikram@hostelsync.edu',
      password: hashedPassword,
      role: 'student',
      hostelBlock: 'Block B (Aryabhata)',
      roomNumber: 'B-204',
      room: roomB204._id,
      department: 'Computer Science & Engg',
      year: 'Year 3',
      attendancePercentage: 92.0
    });

    const wardenRK = await User.create({
      name: 'Dr. R. K. Verma',
      email: 'warden@hostelsync.edu',
      password: hashedPassword,
      role: 'warden',
      hostelBlock: 'Block B (Aryabhata)',
      department: 'Hostel Administration'
    });

    const adminUser = await User.create({
      name: 'Chief Administrator',
      email: 'admin@hostelsync.edu',
      password: hashedPassword,
      role: 'admin',
      hostelBlock: 'Main Campus Admin'
    });

    // Link occupants to room
    roomB204.occupants = [studentAarav._id, studentVikram._id];
    await roomB204.save();

    // 3. Create Sample Complaint
    await Complaint.create({
      ticketId: 'CMP-2026-104',
      student: studentAarav._id,
      title: 'Water Heater Leaking in Room B-204 Bathroom',
      description: 'The geyser valve is leaking hot water onto the bathroom floor.',
      category: 'Plumbing',
      priority: 'HIGH',
      status: 'In Progress',
      assignedTechnician: 'Plumbing Staff (Rajesh M.)',
      slaHours: 24,
      aiTriageReason: 'Auto-triaged by Complaint Agent (Water Leak -> HIGH Priority SLA)'
    });

    // 4. Create Sample Leave Request
    await LeaveRequest.create({
      leaveId: 'LVE-802',
      student: studentAarav._id,
      reason: 'Attending Cousin Sister Marriage in Jaipur',
      fromDate: new Date('2026-10-02'),
      toDate: new Date('2026-10-06'),
      status: 'Approved',
      aiRecommendation: 'APPROVE',
      aiConfidence: 0.94,
      aiReasoning: 'Student attendance 88.5% satisfies requirement (>75%).',
      wardenApprovedBy: wardenRK._id
    });

    // 5. Create Sample Payment
    await Payment.create({
      paymentId: 'PAY-2026-001',
      student: studentAarav._id,
      amount: 65000,
      feeType: 'FullSemester',
      razorpayOrderId: 'order_Nzk9204185',
      razorpayPaymentId: 'pay_Nzk9204185102',
      status: 'SUCCESS'
    });

    // 6. Create Sample Visitor
    await Visitor.create({
      visitorId: 'VIS-401',
      student: studentAarav._id,
      guestName: 'Mr. Ramesh Sharma',
      relation: 'Father',
      phone: '+91-9876500000',
      status: 'Approved',
      gatePassCode: 'PASS-8921',
      approvedBy: wardenRK._id
    });

    console.log('✅ MongoDB Seeding Complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding Error:', err);
    process.exit(1);
  }
};

seedData();
