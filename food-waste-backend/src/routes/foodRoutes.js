const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const controller = require("../controllers/foodController");

router.post("/", auth, controller.postFood);
router.get("/nearby", auth, controller.getNearbyFood);
router.post("/:id/accept", auth, controller.acceptFood);
router.post("/:id/pickup", auth, controller.pickupFood);
router.post("/:id/deliver", auth, controller.deliverFood);

module.exports = router;
