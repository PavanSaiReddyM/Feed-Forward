const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema({
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  foodName: String,
  foodType: String,
  quantity: String,
  expiryTime: { type: Date, required: false },
  imageUrl: String,
  location: {
    latitude: Number,
    longitude: Number
  },
  pickupTime: String,
  note: String,
  status: {
    type: String,
    enum: ["available", "accepted", "picked", "delivered"],
    default: "available"
  },
  acceptedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Food", FoodSchema);
