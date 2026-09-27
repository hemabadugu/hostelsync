const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'warden', 'admin'], default: 'student', index: true },
  hostelBlock: { type: String, default: 'Block B (Aryabhata)' },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  roomNumber: { type: String, default: 'B-204' },
  department: { type: String, default: 'Computer Science & Engg' },
  year: { type: String, default: 'Year 3' },
  attendancePercentage: { type: Number, default: 88.5 },
  phone: { type: String, default: '+91-9876543210' },
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
