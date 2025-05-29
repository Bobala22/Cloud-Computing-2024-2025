// bigquery-service/routes/index.js
const express = require('express');
const router = express.Router();
const fleetController = require('../controllers/fleetController');

router.post('/train-model', fleetController.trainModel);
router.post('/predict-fuel', fleetController.predictFuel);
router.get('/route-improvements', fleetController.getRouteImprovements);
router.get('/traffic-hours', fleetController.getTrafficHours);

module.exports = router;