const Food = require("../models/Food");
const User = require("../models/User");
const Complaint = require("../models/Complaint");

// Donor dashboard
exports.donorDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;
    // Total donations by donor
    const totalDonations = await Food.countDocuments({ donorId: userId });
    // Completed donations
    const completed = await Food.countDocuments({ donorId: userId, status: "delivered" });
    // Active donations
    const active = await Food.countDocuments({ donorId: userId, status: { $in: ["available", "accepted", "picked"] } });
    // People fed (estimate based on quantity)
    const foods = await Food.find({ donorId: userId });
    let peopleFed = 0;
    foods.forEach(f => {
      if (f.quantity) {
        // Try to parse quantity as number, default to 2 people per item
        const qty = parseInt(f.quantity) || 1;
        peopleFed += qty * 2;
      }
    });
    // Recent activity (last 5 donations)
    const activity = await Food.find({ donorId: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("acceptedBy", "name");
    // Notifications (last 5)
    const notifications = activity.map(f => ({
      id: f._id,
      title: f.foodName + " - " + f.status,
      msg: f.note || f.foodType || "",
      time: f.updatedAt,
      unread: f.status !== "delivered"
    }));
    res.json({
      stats: {
        totalDonations,
        completed,
        active,
        peopleFed
      },
      activity,
      notifications
    });
  } catch (err) {
    console.error("Donor dashboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// NGO dashboard
exports.ngoDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;
    // Total pickups by NGO
    const totalPickups = await Food.countDocuments({ acceptedBy: userId });
    // Completed pickups
    const completed = await Food.countDocuments({ acceptedBy: userId, status: "delivered" });
    // Active pickups
    const active = await Food.countDocuments({ acceptedBy: userId, status: { $in: ["accepted", "picked"] } });
    // Available food (not yet accepted)
    const available = await Food.countDocuments({ status: "available" });
    // People fed
    const foods = await Food.find({ acceptedBy: userId });
    let peopleFed = 0;
    foods.forEach(f => {
      if (f.quantity) {
        const qty = parseInt(f.quantity) || 1;
        peopleFed += qty * 2;
      }
    });
    // Recent activity (last 5 pickups)
    const activity = await Food.find({ acceptedBy: userId })
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate("donorId", "name");
    // Notifications (last 5)
    const notifications = activity.map(f => ({
      id: f._id,
      title: f.foodName + " - " + f.status,
      msg: f.note || f.foodType || "",
      time: f.updatedAt,
      unread: f.status !== "delivered"
    }));
    res.json({
      stats: {
        totalPickups,
        completed,
        active,
        available,
        peopleFed
      },
      activity,
      notifications
    });
  } catch (err) {
    console.error("NGO dashboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin dashboard
exports.adminDashboard = async (req, res) => {
  try {
    // Platform-wide stats
    const totalDonations = await Food.countDocuments({});
    const activeFood = await Food.countDocuments({ status: "available" });
    const completedFood = await Food.countDocuments({ status: "delivered" });
    const totalDonors = await User.countDocuments({ role: "donor" });
    const totalNGOs = await User.countDocuments({ role: "ngo" });
    
    // Weekly stats (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weeklyDonations = await Food.countDocuments({ createdAt: { $gte: weekAgo } });
    
    // Top donors (by donations)
    const topDonors = await Food.aggregate([
      { $group: { _id: "$donorId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
      { $unwind: "$user" },
      { $project: { name: "$user.name", count: 1 } }
    ]);
    
    // Top NGOs (by pickups)
    const topNGOs = await Food.aggregate([
      { $match: { acceptedBy: { $ne: null } } },
      { $group: { _id: "$acceptedBy", pickups: { $sum: 1 } } },
      { $sort: { pickups: -1 } },
      { $limit: 5 },
      { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
      { $unwind: "$user" },
      { $project: { name: "$user.name", pickups: 1 } }
    ]);
    
    // Recent activity (last 10 donations/pickups)
    const activity = await Food.find()
      .sort({ updatedAt: -1 })
      .limit(10)
      .populate("donorId", "name")
      .populate("acceptedBy", "name");
    
    // Get all food with donation details for admin view
    const allFood = await Food.find()
      .sort({ createdAt: -1 })
      .populate("donorId", "name email")
      .populate("acceptedBy", "name email");
    
    res.json({
      stats: {
        totalDonations,
        activeFood,
        completedFood,
        totalDonors,
        totalNGOs,
        weeklyDonations
      },
      topDonors,
      topNGOs,
      activity,
      allFood,
      notifications: activity
    });
  } catch (err) {
    console.error("Admin dashboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

