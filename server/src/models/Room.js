const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true, index: true },
  hostelBlock: { type: String, required: true, index: true },
  floor: { type: Number, default: 2 },
  capacity: { type: Number, default: 2 },
  occupiedBeds: { type: Number, default: 0 },
  occupants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  facilities: [{ type: String }],
  isMaintenanceLock: { type: Boolean, default: false },
  monthlyRent: { type: Number, default: 35000 }
});

module.exports = mongoose.model('Room', RoomSchema);
