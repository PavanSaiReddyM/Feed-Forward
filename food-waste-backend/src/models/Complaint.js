const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema({
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  reportedAgainst: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  foodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Food"
  },
  reason: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  status: {
    type: String,
    enum: ["pending", "resolved"],
    default: "pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Complaint", ComplaintSchema);
