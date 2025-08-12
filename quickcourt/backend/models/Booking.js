const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  venue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Venue',
    required: true
  },
  court: {
    courtId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    name: String,
    sportType: String
  },
  date: {
    type: Date,
    required: true
  },
  timeSlot: {
    start: { type: String, required: true },
    end: { type: String, required: true }
  },
  duration: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'refunded'],
    default: 'pending'
  },
  cancellationReason: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
