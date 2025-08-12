const express = require('express');
const Booking = require('../models/Booking');
const Venue = require('../models/Venue');
const User = require('../models/User');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// Admin reports only
router.use([auth, adminAuth]);

// Get system overview
router.get('/overview', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalOwners = await User.countDocuments({ role: 'facility_owner' });
    const totalVenues = await Venue.countDocuments({ status: 'approved' });
    const totalBookings = await Booking.countDocuments();
    
    const totalRevenue = await Booking.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    res.json({
      totalUsers,
      totalOwners,
      totalVenues,
      totalBookings,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get booking trends
router.get('/booking-trends', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const trends = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $in: ['confirmed', 'completed'] }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          bookings: { $sum: 1 },
          revenue: { $sum: '$totalPrice' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    res.json(trends);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
