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
    // Only delivered for now; add expired if you add that status
    const foods = await Food.find({ donorId: req.user.userId, status: "delivered" }).sort({ createdAt: -1 });
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch donor's donation history" });
  }
};
// Get all foods posted by the logged-in donor
exports.getDonorFoods = async (req, res) => {
  try {
    const foods = await Food.find({ donorId: req.user.userId }).sort({ createdAt: -1 });
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch donor's foods" });
  }
};
const Food = require("../models/Food");
const User = require("../models/User");
const { getDistanceInKm } = require("../utils/distance");

exports.postFood = async (req, res) => {
  const food = await Food.create({
    ...req.body,
    donorId: req.user.userId,
    location: req.body.location
  });
  res.json(food);
};

exports.getNearbyFood = async (req, res) => {
  const receiver = await User.findById(req.user.userId);
  const foods = await Food.find({ status: "available" });

  const nearby = foods.filter(food =>
    getDistanceInKm(food.location, receiver.location) <= 1
  );

  res.json(nearby);
};

exports.acceptFood = async (req, res) => {
  const food = await Food.findById(req.params.id);
  food.status = "accepted";
  food.acceptedBy = req.user.userId;
  await food.save();
  res.json(food);
};

exports.pickupFood = async (req, res) => {
  const food = await Food.findById(req.params.id);
  food.status = "picked";
  await food.save();
  res.json(food);
};

exports.deliverFood = async (req, res) => {
  const food = await Food.findById(req.params.id);
  food.status = "delivered";
  await food.save();
  res.json(food);
};
