const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const Complaint = require("../models/Complaint");


router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role === "admin") {
      return res
        .status(403)
        .json({ msg: "Admin cannot create complaints" });
    }
    const complaint = await Complaint.create({
      reportedBy: req.user.userId,
      reportedAgainst: req.body.reportedAgainst,
      foodId: req.body.foodId,
      reason: req.body.reason,
      description: req.body.description
    });
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});


router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const complaints = await Complaint.find()
        .populate("reportedBy", "name email role")
        .populate("reportedAgainst", "name email role")
        .populate("foodId", "foodName");

      res.json(complaints);
    } catch (err) {
      res.status(500).json({ msg: "Server error" });
    }
  }
);

router.put(
  "/resolve/:id",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const complaint = await Complaint.findById(req.params.id);

      if (!complaint) {
        return res.status(404).json({ msg: "Complaint not found" });
      }

      complaint.status = "resolved";
      await complaint.save();

      res.json({
        msg: "Complaint resolved successfully",
        complaint
      });
    } catch (err) {
      res.status(500).json({ msg: "Server error" });
    }
  }
);


module.exports = router;
