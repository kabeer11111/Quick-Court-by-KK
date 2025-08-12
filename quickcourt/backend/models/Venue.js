const mongoose = require('mongoose');

const courtSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  sportType: {
    type: String,
    required: true
  },
  pricePerHour: {
    type: Number,
    required: true
  },
  operatingHours: {
    start: {
      type: String,
      required: true
    },
    end: {
      type: String,
      required: true
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const venueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sports: [{
    type: String,
    required: true
  }],
  amenities: [String],
  photos: [String],
  courts: [courtSchema],
  rating: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rejectionReason: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Venue', venueSchema);
