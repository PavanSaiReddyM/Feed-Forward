const Food = require("../models/Food");
const User = require("../models/User");
const { getDistanceInKm } = require("../utils/distance");

exports.postFood = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Handle both JSON and FormData requests
    let body = req.body;
    
    // If FormData was sent, fields are in req.body, file is in req.file
    if (!body || !body.location) {
      return res.status(400).json({ message: "Location is required" });
    }

    // Parse location if it's a string (from FormData)
    let location = body.location;
    if (typeof location === "string") {
      try {
        location = JSON.parse(location);
      } catch {
        return res.status(400).json({ message: "Invalid location format. Must be {latitude, longitude}" });
      }
    }

    // Validate location has latitude and longitude
    if (!location || typeof location !== "object" || location.latitude === undefined || location.longitude === undefined) {
      return res.status(400).json({ message: "Location must have latitude and longitude" });
    }

    // Build food object
    const foodData = {
      donorId: req.user.userId,
      foodName: body.foodName,
      quantity: body.quantity,
      location: location,
      status: "available",
    };

    // Parse and validate expiry date
    if (body.expiry && body.expiry.trim()) {
      const expiryDate = new Date(body.expiry);
      // Only include if it's a valid date
      if (!isNaN(expiryDate.getTime())) {
        foodData.expiryTime = expiryDate;
      }
    }

    // Add optional fields
    if (body.foodType) foodData.foodType = body.foodType;
    if (body.pickupTime) foodData.pickupTime = body.pickupTime;
    if (body.note) foodData.note = body.note;
    
    // Handle image if uploaded
    if (req.file) {
      // TODO: Upload to firebase or cloud storage and save URL
      // For now, just store the filename
      foodData.imageUrl = req.file.originalname;
    }

    const food = await Food.create(foodData);
    
    // Return with populated donor details
    const populatedFood = await Food.findById(food._id).populate("donorId", "name email");
    res.json(populatedFood);
  } catch (err) {
    console.error("Error posting food:", err);
    res.status(500).json({ message: "Failed to post food donation" });
  }
};

exports.getNearbyFood = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Get all available food for NGOs to browse with donor details
    const foods = await Food.find({ status: "available" })
      .populate("donorId", "name email")
      .sort({ createdAt: -1 });

    res.json(foods);
  } catch (err) {
    console.error("Error fetching available food:", err);
    res.status(500).json({ message: "Failed to fetch available food" });
  }
};

exports.acceptFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: "Food not found" });

    food.status = "accepted";
    food.acceptedBy = req.user.userId;
    await food.save();
    
    // Populate and return with donor details
    const updatedFood = await Food.findById(food._id)
      .populate("donorId", "name email")
      .populate("acceptedBy", "name email");
    
    res.json(updatedFood);
  } catch (err) {
    console.error("Error accepting food:", err);
    res.status(500).json({ message: "Failed to accept food" });
  }
};

exports.pickupFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: "Food not found" });

    food.status = "picked";
    await food.save();
    
    // Populate and return with details
    const updatedFood = await Food.findById(food._id)
      .populate("donorId", "name email")
      .populate("acceptedBy", "name email");
    
    res.json(updatedFood);
  } catch (err) {
    console.error("Error picking up food:", err);
    res.status(500).json({ message: "Failed to mark food as picked up" });
  }
};

exports.deliverFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: "Food not found" });

    food.status = "delivered";
    await food.save();
    
    // Populate and return with details
    const updatedFood = await Food.findById(food._id)
      .populate("donorId", "name email")
      .populate("acceptedBy", "name email");
    
    res.json(updatedFood);
  } catch (err) {
    console.error("Error delivering food:", err);
    res.status(500).json({ message: "Failed to mark food as delivered" });
  }
};

// Cancel (delete) a food donation by donor if not yet picked up
exports.cancelFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: "Donation not found" });
    if (String(food.donorId) !== String(req.user.userId)) {
      return res.status(403).json({ message: "Not authorized to cancel this donation" });
    }
    if (food.status === "picked" || food.status === "delivered") {
      return res.status(400).json({ message: "Cannot cancel a picked up or delivered donation" });
    }
    await food.deleteOne();
    res.json({ message: "Donation cancelled" });
  } catch (err) {
    res.status(500).json({ message: "Failed to cancel donation" });
  }
};

// Get all delivered (and expired) foods posted by the logged-in donor
exports.getDonorHistory = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    // Get delivered foods with NGO details
    const foods = await Food.find({ donorId: req.user.userId, status: "delivered" })
      .populate("acceptedBy", "name email")
      .sort({ createdAt: -1 });
    res.json(foods);
  } catch (err) {
    console.error("Error fetching donor history:", err);
    res.status(500).json({ message: "Failed to fetch donor's donation history" });
  }
};

// Get all foods posted by the logged-in donor
exports.getDonorFoods = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const foods = await Food.find({ donorId: req.user.userId })
      .populate("acceptedBy", "name email")
      .sort({ createdAt: -1 });
    res.json(foods);
  } catch (err) {
    console.error("Error fetching donor foods:", err);
    res.status(500).json({ message: "Failed to fetch donor's foods" });
  }
};
