const express = require('express');
const mongoose = require('mongoose'); // ADD THIS IMPORT
const Booking = require('../models/Booking');
const Venue = require('../models/Venue');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Create booking - FIXED VERSION
router.post('/', auth, [
  body('venueId').isMongoId(),
  body('courtId').isMongoId(),
  body('date').isISO8601(),
  body('timeSlot.start').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('timeSlot.end').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('duration').isNumeric({ min: 1, max: 8 })
], async (req, res) => {
  try {
    console.log('=== BOOKING CREATION START ===');
    console.log('Request body:', req.body);
    console.log('User ID:', req.userId);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { venueId, courtId, date, timeSlot, duration } = req.body;

    // Check if venue exists and is approved
    const venue = await Venue.findById(venueId);
    console.log('Venue found:', venue ? venue._id : 'Not found');
    
    if (!venue || venue.status !== 'approved') {
      return res.status(404).json({ message: 'Venue not found or not approved' });
    }

    // Find the court
    const court = venue.courts.id(courtId);
    console.log('Court found:', court ? court._id : 'Not found');
    
    if (!court || !court.isActive) {
      return res.status(404).json({ message: 'Court not found or inactive' });
    }

    // Check for booking conflicts
    const bookingDate = new Date(date);
    console.log('Booking date:', bookingDate);
    
    const conflictingBooking = await Booking.findOne({
      venue: venueId,
      'court.courtId': courtId,
      date: bookingDate,
      status: { $in: ['confirmed'] },
      $or: [
        {
          'timeSlot.start': { $lt: timeSlot.end },
          'timeSlot.end': { $gt: timeSlot.start }
        }
      ]
    });

    if (conflictingBooking) {
      console.log('Conflicting booking found:', conflictingBooking._id);
      return res.status(400).json({ message: 'Time slot already booked' });
    }

    // Calculate total price
    const totalPrice = court.pricePerHour * duration;
    console.log('Total price calculated:', totalPrice);

    // CREATE BOOKING WITH PROPER FIELD MAPPING
    const bookingData = {
      user: req.userId,
      venue: venueId,
      court: {
        courtId: courtId,
        name: court.name,
        sportType: court.sportType
      },
      date: bookingDate,
      timeSlot: timeSlot,
      duration: parseInt(duration),
      totalPrice: totalPrice,
      totalAmount: totalPrice, // ADD IF YOUR SCHEMA USES totalAmount
      status: 'confirmed',
      paymentStatus: 'completed' // Simulated payment
    };

    console.log('Booking data to save:', bookingData);

    const booking = new Booking(bookingData);
    
    // CRITICAL: Await the save operation
    const savedBooking = await booking.save();
    console.log('Booking saved with ID:', savedBooking._id);

    // Populate the saved booking
    const populatedBooking = await Booking.findById(savedBooking._id)
      .populate('venue', 'name address')
      .populate('user', 'fullName email');

    console.log('=== BOOKING CREATION SUCCESS ===');
    res.status(201).json({
      success: true,
      booking: populatedBooking
    });

  } catch (error) {
    console.error('=== BOOKING CREATION ERROR ===');
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
});

// Get user's bookings - FIXED VERSION
router.get('/my-bookings', auth, async (req, res) => {
  try {
    console.log('Fetching bookings for user:', req.userId);
    
    const { status, page = 1, limit = 10 } = req.query;
    
    const query = { user: req.userId };
    if (status) {
      query.status = status;
    }

    console.log('Query:', query);

    const bookings = await Booking.find(query)
      .populate('venue', 'name address photos')
      .sort({ date: -1, 'timeSlot.start': -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(query);

    console.log('Bookings found:', bookings.length);

    res.json({
      success: true,
      bookings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('My bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel booking - SAME AS YOUR CODE
router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    const { cancellationReason } = req.body;

    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (booking.status !== 'confirmed') {
      return res.status(400).json({ message: 'Cannot cancel this booking' });
    }

    // Check if booking is in the future
    const now = new Date();
    const bookingDateTime = new Date(`${booking.date.toISOString().split('T')[0]}T${booking.timeSlot.start}`);
    
    if (bookingDateTime <= now) {
      return res.status(400).json({ message: 'Cannot cancel past bookings' });
    }

    booking.status = 'cancelled';
    booking.cancellationReason = cancellationReason;
    booking.paymentStatus = 'refunded';

    await booking.save();

    res.json(booking);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get venue bookings (for facility owners) - FIXED VERSION
router.get('/venue/:venueId', auth, async (req, res) => {
  try {
    console.log('Fetching venue bookings for:', req.params.venueId);
    console.log('User role:', req.userRole);
    console.log('User ID:', req.userId);
    
    if (req.userRole !== 'facility_owner' && req.userRole !== 'owner') { // ADD 'owner' as alternative
      return res.status(403).json({ message: 'Access denied' });
    }

    // Verify venue ownership
    const venue = await Venue.findById(req.params.venueId);
    if (!venue || venue.owner.toString() !== req.userId) {
      console.log('Venue ownership verification failed');
      return res.status(403).json({ message: 'Access denied' });
    }

    const { status, date, page = 1, limit = 20 } = req.query;
    
    const query = { venue: req.params.venueId };
    if (status) query.status = status;
    if (date) {
      const queryDate = new Date(date);
      query.date = {
        $gte: new Date(queryDate.setHours(0, 0, 0, 0)),
        $lt: new Date(queryDate.setHours(23, 59, 59, 999))
      };
    }

    console.log('Venue bookings query:', query);

    const bookings = await Booking.find(query)
      .populate('user', 'fullName email')
      .sort({ date: 1, 'timeSlot.start': 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(query);

    console.log('Venue bookings found:', bookings.length);

    res.json({
      success: true,
      bookings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Venue bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get booking analytics for venue owner - FIXED VERSION
router.get('/analytics/:venueId', auth, async (req, res) => {
  try {
    if (req.userRole !== 'facility_owner' && req.userRole !== 'owner') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Verify venue ownership
    const venue = await Venue.findById(req.params.venueId);
    if (!venue || venue.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { period = '30' } = req.query;
    const periodDays = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    // Total bookings and earnings
    const totalBookings = await Booking.countDocuments({
      venue: req.params.venueId,
      status: { $in: ['confirmed', 'completed'] }
    });

    const totalEarnings = await Booking.aggregate([
      {
        $match: {
          venue: new mongoose.Types.ObjectId(req.params.venueId), // FIXED: Use 'new'
          status: { $in: ['confirmed', 'completed'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalPrice' }
        }
      }
    ]);

    // Booking trends
    const bookingTrends = await Booking.aggregate([
      {
        $match: {
          venue: new mongoose.Types.ObjectId(req.params.venueId), // FIXED: Use 'new'
          date: { $gte: startDate },
          status: { $in: ['confirmed', 'completed'] }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          bookings: { $sum: 1 },
          earnings: { $sum: '$totalPrice' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Peak hours
    const peakHours = await Booking.aggregate([
      {
        $match: {
          venue: new mongoose.Types.ObjectId(req.params.venueId), // FIXED: Use 'new'
          status: { $in: ['confirmed', 'completed'] }
        }
      },
      {
        $group: {
          _id: '$timeSlot.start',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      totalBookings,
      totalEarnings: totalEarnings[0]?.total || 0,
      activeCourts: venue.courts.filter(c => c.isActive).length,
      bookingTrends,
      peakHours
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark booking as completed - SAME AS YOUR CODE
router.patch('/:id/complete', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const venue = await Venue.findById(booking.venue);
    if (booking.user.toString() !== req.userId && venue.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (booking.status !== 'confirmed') {
      return res.status(400).json({ message: 'Cannot complete this booking' });
    }

    booking.status = 'completed';
    await booking.save();

    res.json(booking);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
