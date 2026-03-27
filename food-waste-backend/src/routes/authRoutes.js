const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const controller = require("../controllers/authController");
const { register, login } = require("../controllers/authController");

// Get and update current user's profile
router.get("/me", auth, controller.getProfile);
router.put("/me", auth, controller.updateProfile);

router.post("/register", register);
router.post("/login", login);

module.exports = router;
