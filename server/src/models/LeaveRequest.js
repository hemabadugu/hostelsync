const mongoose = require('mongoose');

const LeaveRequestSchema = new mongoose.Schema({
  leaveId: { type: String, required: true, unique: true, index: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  reason: { type: String, required: true },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending',
    index: true 
  },
  aiRecommendation: { type: String, enum: ['APPROVE', 'REJECT', 'MANUAL_REVIEW'], default: 'MANUAL_REVIEW' },
  aiConfidence: { type: Number, default: 0.90 },
  aiReasoning: { type: String },
  wardenApprovedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LeaveRequest', LeaveRequestSchema);
