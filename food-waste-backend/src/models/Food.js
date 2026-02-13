const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema({
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  foodName: String,
  quantity: String,
  expiryTime: Date,
  imageUrl: String,
  location: {
    latitude: Number,
    longitude: Number
  },
  status: {
    type: String,
    enum: ["available", "accepted", "picked", "delivered"],
    default: "available"
  },
  acceptedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Food", FoodSchema);
