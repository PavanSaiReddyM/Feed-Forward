const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const dashboardController = require("../controllers/dashboardController");

// Donor dashboard
router.get("/donor", authMiddleware, roleMiddleware("donor"), dashboardController.donorDashboard);

// NGO dashboard
router.get("/ngo", authMiddleware, roleMiddleware("ngo"), dashboardController.ngoDashboard);

// Admin dashboard
router.get("/admin", authMiddleware, roleMiddleware("admin"), dashboardController.adminDashboard);

module.exports = router;
