const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const controller = require('../controllers/requestsController');


// NGO requests a food donation
router.post('/', auth, controller.createRequest);

// Get all requests made by the logged-in NGO
router.get('/', auth, controller.getNgoRequests);

module.exports = router;
