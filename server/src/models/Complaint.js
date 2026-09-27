const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  ticketId: { type: String, required: true, unique: true, index: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Plumbing', 'Electrical', 'Network', 'Carpentry', 'General'], 
    default: 'General',
    index: true 
  },
  priority: { 
    type: String, 
    enum: ['LOW', 'MEDIUM', 'HIGH', 'EMERGENCY'], 
    default: 'MEDIUM',
    index: true 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Assigned', 'In Progress', 'Resolved'], 
    default: 'Pending',
    index: true 
  },
  assignedTechnician: { type: String, default: 'Unassigned' },
  slaHours: { type: Number, default: 24 },
  aiTriageReason: { type: String },
  resolvedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Complaint', ComplaintSchema);
