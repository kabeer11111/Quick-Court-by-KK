const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import models and middleware
const User = require('./models/User');
const authenticateToken = require('./middleware/auth');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static('uploads'));

// Create uploads directory if it doesn't exist
const uploadsDir = 'uploads/avatars';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = `avatar-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files allowed'));
    }
  }
});

// Avatar upload route
app.post('/api/users/avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
  try {
    console.log('Avatar upload started for user:', req.user.id);
    console.log('File received:', req.file);
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No file uploaded' 
      });
    }

    const userId = req.user.id;
    const avatarPath = `/uploads/avatars/${req.file.filename}`;
    
    // Update user with avatar path - CRITICAL: Use await
    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      { avatar: avatarPath }, 
      { new: true }
    );

    console.log('User updated with avatar:', updatedUser.avatar);
    
    if (!updatedUser) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    res.json({
      success: true,
      message: 'Avatar updated successfully',
      avatar: avatarPath
    });
    
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Debug route - MOVED OUTSIDE AND PLACED PROPERLY
app.get('/api/debug/routes', (req, res) => {
  res.json({
    success: true,
    availableRoutes: [
      'GET /api/debug/routes',
      'GET /api/health',
      'POST /api/users/avatar',
      'POST /api/auth/signup',
      'POST /api/auth/login',
      'POST /api/auth/verify-otp',
      'GET /api/venues',
      'POST /api/bookings',
      'GET /api/bookings/my-bookings',
      // Add more routes as needed
    ],
    message: 'Available API endpoints'
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/venues', require('./routes/venues'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/reports', require('./routes/reports'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quickcourt', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
