const express = require('express');
const multer = require('multer');
const path = require('path');
const Venue = require('../models/Venue');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/venues/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Get all approved venues with filters
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sport, 
      minPrice, 
      maxPrice, 
      city, 
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = { status: 'approved' };

    // Filters
    if (sport) {
      query.sports = { $in: [sport] };
    }
    
    if (city) {
      query['address.city'] = new RegExp(city, 'i');
    }

    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    // Price filter (find venues with courts in price range)
    if (minPrice || maxPrice) {
      const priceQuery = {};
      if (minPrice) priceQuery.$gte = parseInt(minPrice);
      if (maxPrice) priceQuery.$lte = parseInt(maxPrice);
      query['courts.pricePerHour'] = priceQuery;
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const venues = await Venue.find(query)
      .populate('owner', 'fullName email')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Venue.countDocuments(query);

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

// Get popular venues and sports
router.get('/popular', async (req, res) => {
  try {
    // Get popular venues (by booking count)
    const popularVenues = await Booking.aggregate([
      { $group: { _id: '$venue', bookingCount: { $sum: 1 } } },
      { $sort: { bookingCount: -1 } },
      { $limit: 6 },
      {
        $lookup: {
          from: 'venues',
          localField: '_id',
          foreignField: '_id',
          as: 'venue'
        }
      },
      { $unwind: '$venue' },
      { $match: { 'venue.status': 'approved' } }
    ]);

    // Get popular sports
    const popularSports = await Booking.aggregate([
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
      { $group: { _id: '$venueData.sports', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 }
    ]);

    res.json({
      popularVenues,
      popularSports
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single venue
router.get('/:id', async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id)
      .populate('owner', 'fullName email');

    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    // Get reviews
    const reviews = await Review.find({ venue: venue._id })
      .populate('user', 'fullName avatar')
      .sort({ createdAt: -1 });

    res.json({
      venue,
      reviews
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create venue (facility owners only)
router.post('/', auth, upload.array('photos', 10), [
  body('name').trim().isLength({ min: 2 }),
  body('description').trim().isLength({ min: 10 }),
  body('sports').isArray({ min: 1 })
], async (req, res) => {
  try {
    if (req.userRole !== 'facility_owner') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      description,
      address,
      sports,
      amenities,
      courts
    } = req.body;

    const photos = req.files ? req.files.map(file => file.path) : [];

    const venue = new Venue({
      name,
      description,
      address: JSON.parse(address),
      owner: req.userId,
      sports: JSON.parse(sports),
      amenities: amenities ? JSON.parse(amenities) : [],
      photos,
      courts: courts ? JSON.parse(courts) : []
    });

    await venue.save();
    res.status(201).json(venue);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update venue
router.put('/:id', auth, upload.array('photos', 10), async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    if (venue.owner.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updateData = { ...req.body };
    
    // Parse JSON fields
    if (updateData.address) updateData.address = JSON.parse(updateData.address);
    if (updateData.sports) updateData.sports = JSON.parse(updateData.sports);
    if (updateData.amenities) updateData.amenities = JSON.parse(updateData.amenities);
    if (updateData.courts) updateData.courts = JSON.parse(updateData.courts);

    // Handle new photos
    if (req.files && req.files.length > 0) {
      const newPhotos = req.files.map(file => file.path);
      updateData.photos = [...(venue.photos || []), ...newPhotos];
    }

    const updatedVenue = await Venue.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedVenue);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get owner's venues
router.get('/owner/my-venues', auth, async (req, res) => {
  try {
    if (req.userRole !== 'facility_owner') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const venues = await Venue.find({ owner: req.userId })
      .sort({ createdAt: -1 });

    res.json(venues);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add review
router.post('/:id/review', auth, [
  body('rating').isInt({ min: 1, max: 5 }),
  body('comment').trim().isLength({ min: 5 })
], async (req, res) => {
  try {
    if (req.userRole !== 'user') {
      return res.status(403).json({ message: 'Only users can leave reviews' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating, comment, bookingId } = req.body;

    // Check if user has a completed booking for this venue
    const booking = await Booking.findOne({
      _id: bookingId,
      user: req.userId,
      venue: req.params.id,
      status: 'completed'
    });

    if (!booking) {
      return res.status(400).json({ message: 'You can only review venues you have used' });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      user: req.userId,
      venue: req.params.id,
      booking: bookingId
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this booking' });
    }

    const review = new Review({
      user: req.userId,
      venue: req.params.id,
      booking: bookingId,
      rating,
      comment
    });

    await review.save();

    // Update venue rating
    const reviews = await Review.find({ venue: req.params.id });
    const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    await Venue.findByIdAndUpdate(req.params.id, {
      'rating.average': averageRating,
      'rating.count': reviews.length
    });

    res.status(201).json(review);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
