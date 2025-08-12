const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'owner', 'admin'], // Changed 'facility_owner' to 'owner'
    default: 'user'
  },
  avatar: {
    type: String,
    default: null // Changed from '' to null for consistency
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    type: String,
    default: null
  },
  otpExpires: { // Changed from 'otpExpiry' to 'otpExpires'
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Password comparison method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Add method to generate OTP
// In models/User.js - Update generateOTP method
userSchema.methods.generateOTP = function() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  this.otp = otp;
  this.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return otp;
};


// Add method to verify OTP
userSchema.methods.verifyOTP = function(candidateOTP) {
  if (!this.otp || !this.otpExpires) {
    return false;
  }
  
  if (this.otpExpires < new Date()) {
    return false; // OTP expired
  }
  
  return this.otp === candidateOTP;
};

// Add method to clear OTP
userSchema.methods.clearOTP = function() {
  this.otp = null;
  this.otpExpires = null;
};

module.exports = mongoose.model('User', userSchema);
