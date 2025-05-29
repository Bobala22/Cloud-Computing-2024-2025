// firestore-service/controllers/maintenanceController.js
const firestoreService = require('../services/firestoreService');

class MaintenanceController {
  async addMaintenance(req, res) {
    try {
      const maintenance = await firestoreService.addMaintenance(req.body);
      res.status(201).json(maintenance);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateCarMileageAndLocation(req, res) {
    try {
      const { carId, distance, endLocation } = req.body;
      await firestoreService.updateCarMileageAndLocation(carId, distance, endLocation);
      res.status(200).json({ message: 'Car mileage and location updated' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new MaintenanceController();