const mongoose = require('mongoose');

const VisitorSchema = new mongoose.Schema({
  visitorId: { type: String, required: true, unique: true, index: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  guestName: { type: String, required: true },
  relation: { type: String, required: true },
  phone: { type: String },
  entryTime: { type: Date, default: Date.now },
  exitTime: { type: Date },
  gatePassCode: { type: String },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Denied', 'CheckedIn', 'CheckedOut'], 
    default: 'Pending',
    index: true 
  },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Visitor', VisitorSchema);
