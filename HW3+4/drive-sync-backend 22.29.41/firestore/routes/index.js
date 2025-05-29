const express = require('express');
const carController = require('../controllers/carController');
const maintenanceController = require('../controllers/maintenanceController');

const router = express.Router();

router.post('/cars', carController.addCar);
router.get('/cars', carController.getAllCars);
router.put('/cars/:id', carController.updateCar);
router.delete('/cars/:id', carController.deleteCar);
router.post('/maintenance', maintenanceController.addMaintenance);
router.post('/cars/update-mileage', maintenanceController.updateCarMileageAndLocation);

module.exports = router;