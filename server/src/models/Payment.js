const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  paymentId: { type: String, required: true, unique: true, index: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  amount: { type: Number, required: true },
  feeType: { 
    type: String, 
    enum: ['RoomRent', 'MessAdvance', 'CautionDeposit', 'AmenitiesFee', 'FullSemester'], 
    default: 'FullSemester' 
  },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  status: { 
    type: String, 
    enum: ['PENDING', 'SUCCESS', 'FAILED'], 
    default: 'PENDING',
    index: true 
  },
  paidAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', PaymentSchema);
