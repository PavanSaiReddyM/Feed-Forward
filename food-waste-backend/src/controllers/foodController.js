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
