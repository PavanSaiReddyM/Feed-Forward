const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const User = require("../models/User");
const Food = require("../models/Food");


router.get(
  "/users",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const users = await User.find().select("name email role");
      console.log(users);
      res.json(users);
    } catch (err) {
      res.status(500).json({ msg: "Server error" });
    }
  }
);


router.put(
  "/verify/:id",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      user.isVerified = true;
      await user.save();

      res.json({ msg: "User verified successfully" });
    } catch (err) {
      res.status(500).json({ msg: "Server error" });
    }
  }
);


router.put(
  "/block/:id",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      user.isVerified = false;
      await user.save();

      res.json({ msg: "User blocked successfully" });
    } catch (err) {
      res.status(500).json({ msg: "Server error" });
    }
  }
);


router.get(
  "/foods",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const foods = await Food.find()
        .populate("donorId", "name email")
        .populate("acceptedBy", "name email");

      res.json(foods);
    } catch (err) {
      res.status(500).json({ msg: "Server error" });
    }
  }
);


router.delete(
  "/food/:id",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const food = await Food.findById(req.params.id);

      if (!food) {
        return res.status(404).json({ msg: "Food not found" });
      }

      await food.deleteOne();
      res.json({ msg: "Food removed successfully" });
    } catch (err) {
      res.status(500).json({ msg: "Server error" });
    }
  }
);

router.get("/dashboard", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalFoods = await Food.countDocuments();
    const deliveredFoods = await Food.countDocuments({ status: "delivered" });
    const pendingComplaints = await Complaint.countDocuments({ status: "pending" });

    res.json({
      totalUsers,
      totalFoods,
      deliveredFoods,
      pendingComplaints
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});


module.exports = router;
