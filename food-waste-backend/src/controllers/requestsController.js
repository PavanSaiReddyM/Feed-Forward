// Get all requests made by the logged-in NGO
exports.getNgoRequests = async (req, res) => {
  try {
    const ngoId = req.user.userId;
    const requests = await Request.find({ ngoId })
      .populate('foodId')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch requests' });
  }
};
const Request = require('../models/Request');
const Food = require('../models/Food');

// NGO requests a food donation
exports.createRequest = async (req, res) => {
  try {
    const ngoId = req.user.userId;
    const { foodId } = req.body;
    if (!foodId) return res.status(400).json({ message: 'foodId is required' });

    // Check if food exists and is available
    const food = await Food.findById(foodId);
    if (!food || food.status !== 'available') {
      return res.status(404).json({ message: 'Food not available' });
    }

    // Prevent duplicate requests by same NGO for same food
    const existing = await Request.findOne({ foodId, ngoId });
    if (existing) {
      return res.status(409).json({ message: 'You have already requested this donation' });
    }

    const request = await Request.create({ foodId, ngoId });
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create request' });
  }
};
