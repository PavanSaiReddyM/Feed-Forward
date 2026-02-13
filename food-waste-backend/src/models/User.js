const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["donor", "receiver", "admin"] },
  phone: String,
  isVerified: { type: Boolean, default: false },
  location: {
    latitude: Number,
    longitude: Number
  },
  fcmToken: String
});

module.exports = mongoose.model("User", UserSchema);
