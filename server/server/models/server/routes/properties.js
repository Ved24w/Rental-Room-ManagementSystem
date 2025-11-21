// server/routes/properties.js - Snippet for the search route

const router = require('express').Router();
const Property = require('../models/Property');

// @route   GET api/properties/search
// @desc    Intelligent Search & Filter for properties
router.get('/search', async (req, res) => {
  try {
    const { keyword, minPrice, maxPrice, proximity } = req.query;
    let query = {};

    // 1. Keyword/Title Search (e.g., searching for "Studio" or "near park")
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { location: { $regex: keyword, $options: 'i' } }
      ];
    }
    
    // 2. Price Filtering
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }
    
    // 3. Proximity Filter (Key Innovation)
    if (proximity) {
        query.universityProximity = proximity; // e.g., '10-minute walk', '2km radius'
    }

    const properties = await Property.find(query).sort({ createdAt: -1 }); // Sort by newest
    res.json(properties);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
