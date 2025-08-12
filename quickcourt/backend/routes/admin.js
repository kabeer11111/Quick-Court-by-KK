const express = require('express');
const User = require('../models/User');
const Venue = require('../models/Venue');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// Admin dashboard stats
router.get('/dashboard', [auth, adminAuth], async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalFacilityOwners = await User.countDocuments({ role: 'facility_owner' });
    const totalBookings = await Booking.countDocuments();
    const totalActiveCourts = await Venue.aggregate([
      { $match: { status: 'approved' } },
      { $unwind: '$courts' },
      { $match: { 'courts.isActive': true } },
      { $count: 'total' }
    ]);

    // Booking activity over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const bookingActivity = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          bookings: { $sum: 1 },
          earnings: { $sum: '$totalPrice' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // User registration trends
    const userRegistrations = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          users: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Facility approval trends
    const facilityApprovals = await Venue.aggregate([
      {
        $match: {
          status: 'approved',
          updatedAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' } },
          facilities: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Most active sports
    const activeSports = await Booking.aggregate([
      {
        $lookup: {
          from: 'venues',
          localField: 'venue',
          foreignField: '_id',
          as: 'venueData'
        }
      },
      { $unwind: '$venueData' },
      { $unwind: '$venueData.sports' },
      {
        $group: {
          _id: '$venueData.sports',
          bookings: { $sum: 1 }
        }
      },
      { $sort: { bookings: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      stats: {
        totalUsers,
        totalFacilityOwners,
        totalBookings,
        totalActiveCourts: totalActiveCourts[0]?.total || 0
      },
      charts: {
        bookingActivity,
        userRegistrations,
        facilityApprovals,
        activeSports
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get pending venue approvals
router.get('/venues/pending', [auth, adminAuth], async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const venues = await Venue.find({ status: 'pending' })
      .populate('owner', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Venue.countDocuments({ status: 'pending' });

    res.json({
      venues,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve/Reject venue
router.patch('/venues/:id/status', [auth, adminAuth], async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updateData = { status };
    if (status === 'rejected' && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    const venue = await Venue.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('owner', 'fullName email');

    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    // TODO: Send email notification to facility owner

    res.json(venue);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
router.get('/users', [auth, adminAuth], async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search, status } = req.query;

    const query = {};
    if (role && role !== 'all') {
      query.role = role;
    }
    if (status) {
      query.isActive = status === 'active';
    }
    if (search) {
      query.$or = [
        { fullName: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }

    const users = await User.find(query)
      .select('-password -otp')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Ban/Unban user
router.patch('/users/:id/status', [auth, adminAuth], async (req, res) => {
  try {
    const { isActive } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot modify admin users' });
    }

    user.isActive = isActive;
    await user.save();

    res.json({ message: `User ${isActive ? 'activated' : 'deactivated'} successfully` });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user booking history
router.get('/users/:id/bookings', [auth, adminAuth], async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const bookings = await Booking.find({ user: req.params.id })
      .populate('venue', 'name address')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments({ user: req.params.id });

    res.json({
      bookings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
