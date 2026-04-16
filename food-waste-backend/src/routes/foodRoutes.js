const router = require("express").Router();
const multer = require("multer");
const auth = require("../middlewares/authMiddleware");
const controller = require("../controllers/foodController");

// Configure multer for file uploads (in memory)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Cancel (delete) a food donation by donor
router.delete("/:id", auth, controller.cancelFood);
// Get all delivered (and expired) foods posted by the logged-in donor
router.get("/donor/history", auth, controller.getDonorHistory);
router.post("/", auth, upload.single("image"), controller.postFood);
// Get all foods posted by the logged-in donor
router.get("/donor", auth, controller.getDonorFoods);
router.get("/nearby", auth, controller.getNearbyFood);
router.post("/:id/accept", auth, controller.acceptFood);
router.post("/:id/pickup", auth, controller.pickupFood);
router.post("/:id/deliver", auth, controller.deliverFood);

module.exports = router;