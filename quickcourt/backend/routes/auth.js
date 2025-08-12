const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Email transporter (configure with your email service)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// FIXED: Signup route with proper role validation and response format
router.post('/signup', [
  body('fullName').trim().isLength({ min: 2 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['user', 'owner']) // FIXED: Changed from 'facility_owner' to 'owner'
], async (req, res) => {
  try {
    console.log('Signup request received:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, // FIXED: Added success flag
        errors: errors.array() 
      });
    }

    const { fullName, email, password, role, avatar } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ 
        success: false, // FIXED: Added success flag
        message: 'User already exists' 
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Create user
    user = new User({
      fullName,
      email,
      password,
      role,
      avatar,
      otp,
      otpExpiry,
      isVerified: false
    });

    await user.save();
    console.log(`OTP for ${email}: ${otp}`);

    // Send OTP email (wrap in try-catch for development)
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'QuickCourt - Verify Your Account',
        html: `
          <h2>Welcome to QuickCourt!</h2>
          <p>Your OTP for account verification is: <strong>${otp}</strong></p>
          <p>This OTP will expire in 10 minutes.</p>
        `
      });
    } catch (emailError) {
      console.log('Email sending failed (continuing without email):', emailError.message);
    }

    res.status(201).json({ 
      success: true, // FIXED: Added success flag
      message: 'User registered successfully. Please check your email for OTP.',
      userId: user._id,
      email: user.email // FIXED: Added email for frontend OTP flow
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      success: false, // FIXED: Added success flag
      message: 'Server error',
      error: error.message 
    });
  }
});

// FIXED: Verify OTP - Accept email instead of userId to match frontend
router.post('/verify-otp', async (req, res) => {
  try {
    console.log('OTP verification request:', req.body);
    
    const { email, otp } = req.body; // FIXED: Accept email instead of userId

    // Find user by email (case-insensitive)
    const user = await User.findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') } 
    });
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({ 
        success: false,
        message: 'User is already verified' 
      });
    }

    // Verify OTP
    if (user.otp !== otp || user.otpExpiry < new Date()) {
      console.log('OTP mismatch:', { stored: user.otp, provided: otp, expired: user.otpExpiry < new Date() });
      return res.status(400).json({ 
        success: false,
        message: 'Invalid or expired OTP' 
      });
    }

    // Update user verification status
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    // FIXED: Generate token with consistent property names
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role }, // FIXED: Use 'id' not 'userId'
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '30d' }
    );

    console.log('OTP verification successful for:', email);

    res.json({
      success: true, // FIXED: Added success flag
      message: 'Email verified successfully',
      token,
      user: {
        _id: user._id, // FIXED: Use _id to match frontend User interface
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
});

// FIXED: Login route with proper response format and token consistency
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], async (req, res) => {
  try {
    console.log('Login attempt for:', req.body.email);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({ 
        success: false,
        message: 'Please verify your email first' 
      });
    }

    if (!user.isActive) {
      return res.status(400).json({ 
        success: false,
        message: 'Account has been suspended' 
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // FIXED: Generate token with consistent property names
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role }, // FIXED: Use 'id' not 'userId'
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '30d' }
    );

    console.log('Login successful for:', email);

    res.json({
      success: true, // FIXED: Added success flag
      message: 'Login successful',
      token,
      user: {
        _id: user._id, // FIXED: Use _id to match frontend User interface
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password -otp');
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

// Update profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { fullName, avatar } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { fullName, avatar },
      { new: true }
    ).select('-password -otp');

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

// Test route for debugging OTP
router.get('/test-otp/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    
    if (!user) {
      return res.json({ message: 'User not found', email });
    }
    
    res.json({
      message: 'User found',
      email: user.email,
      storedOTP: user.otp,
      otpType: typeof user.otp,
      expires: user.otpExpiry, // FIXED: Use correct field name
      isVerified: user.isVerified
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
