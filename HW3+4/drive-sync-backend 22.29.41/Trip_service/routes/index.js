// trip-service/routes/index.js
const express = require('express');
const tripController = require('../controllers/tripController');

const router = express.Router();

router.post('/trips', tripController.addTrip);
router.get('/trips', tripController.getAllTrips);

module.exports = router;