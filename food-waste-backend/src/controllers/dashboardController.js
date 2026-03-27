const Food = require("../models/Food");
const User = require("../models/User");
const Complaint = require("../models/Complaint");

// Donor dashboard
exports.donorDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;
    // Total donations by donor
    const totalDonations = await Food.countDocuments({ donor: userId });
    // Completed donations
    const completed = await Food.countDocuments({ donor: userId, status: "Delivered" });
    // Active donations
    const active = await Food.countDocuments({ donor: userId, status: { $in: ["Posted", "Accepted", "En Route"] } });
    // People fed (sum of peopleFed field if exists, else estimate)
    const foods = await Food.find({ donor: userId });
    let peopleFed = 0;
    foods.forEach(f => {
      if (f.peopleFed) peopleFed += f.peopleFed;
      else if (f.quantity) peopleFed += Math.round(f.quantity * 2); // estimate: 1kg feeds 2 people
    });
    // Recent activity (last 5 donations)
    const activity = await Food.find({ donor: userId }).sort({ createdAt: -1 }).limit(5);
    // Notifications (last 5)
    // For demo, just return recent activity as notifications
    const notifications = activity.map(f => ({
      id: f._id,
      title: f.foodName + " status: " + f.status,
      msg: f.description || "",
      time: f.updatedAt,
      unread: f.status !== "Delivered"
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
    res.status(500).json({ message: "Server error" });
  }
};

// NGO dashboard
exports.ngoDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;
    // Total pickups by NGO
    const totalPickups = await Food.countDocuments({ ngo: userId });
    // Completed pickups
    const completed = await Food.countDocuments({ ngo: userId, status: "Delivered" });
    // Active pickups
    const active = await Food.countDocuments({ ngo: userId, status: { $in: ["Accepted", "En Route"] } });
    // People fed
    const foods = await Food.find({ ngo: userId });
    let peopleFed = 0;
    foods.forEach(f => {
      if (f.peopleFed) peopleFed += f.peopleFed;
      else if (f.quantity) peopleFed += Math.round(f.quantity * 2);
    });
    // Recent activity (last 5 pickups)
    const activity = await Food.find({ ngo: userId }).sort({ updatedAt: -1 }).limit(5);
    // Notifications (last 5)
    const notifications = activity.map(f => ({
      id: f._id,
      title: f.foodName + " status: " + f.status,
      msg: f.description || "",
      time: f.updatedAt,
      unread: f.status !== "Delivered"
    }));
    res.json({
      stats: {
        totalPickups,
        completed,
        active,
        peopleFed
      },
      activity,
      notifications
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Admin dashboard
exports.adminDashboard = async (req, res) => {
  try {
    // Platform-wide stats
    const totalMeals = await Food.aggregate([
      { $group: { _id: null, total: { $sum: "$peopleFed" } } }
    ]);
    const totalDonors = await User.countDocuments({ role: "donor" });
    const totalNGOs = await User.countDocuments({ role: "ngo" });
    const pending = await Food.countDocuments({ status: "Posted" });
    // Weekly stats (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weeklyMeals = await Food.aggregate([
      { $match: { createdAt: { $gte: weekAgo } } },
      { $group: { _id: null, total: { $sum: "$peopleFed" } } }
    ]);
    // Top donors (by meals fed)
    const topDonors = await Food.aggregate([
      { $group: { _id: "$donor", meals: { $sum: "$peopleFed" } } },
      { $sort: { meals: -1 } },
      { $limit: 5 },
      { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
      { $unwind: "$user" },
      { $project: { name: "$user.name", meals: 1 } }
    ]);
    // Top NGOs (by pickups)
    const topNGOs = await Food.aggregate([
      { $group: { _id: "$ngo", pickups: { $sum: 1 } } },
      { $sort: { pickups: -1 } },
      { $limit: 5 },
      { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
      { $unwind: "$user" },
      { $project: { name: "$user.name", pickups: 1 } }
    ]);
    // Recent activity (last 5 donations/pickups)
    const activity = await Food.find().sort({ updatedAt: -1 }).limit(5);
    // Notifications (last 5 complaints, pending verifications, etc.)
    const complaints = await Complaint.find().sort({ createdAt: -1 }).limit(5);
    res.json({
      stats: {
        totalMeals: totalMeals[0]?.total || 0,
        totalDonors,
        totalNGOs,
        pending,
        weeklyMeals: weeklyMeals[0]?.total || 0
      },
      topDonors,
      topNGOs,
      activity,
      notifications: complaints
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
