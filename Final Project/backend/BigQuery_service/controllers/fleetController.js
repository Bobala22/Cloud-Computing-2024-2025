// bigquery-service/controllers/fleetController.js
const fleetService = require('../services/fleetService');

class FleetController {
  async trainModel(req, res) {
    try {
      await fleetService.trainFuelModel();
      res.status(200).json({ message: 'Fuel efficiency model trained successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async predictFuel(req, res) {
    try {
      const { distance, trafficHours, fuelType, totalMileage } = req.body;
      const prediction = await fleetService.predictFuelConsumption({
        distance,
        trafficHours,
        fuelType,
        totalMileage,
      });
      res.status(200).json({ predictedFuelConsumption: prediction });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getRouteImprovements(req, res) {
    try {
      const suggestions = await fleetService.suggestRouteImprovements();
      res.status(200).json(suggestions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getTrafficHours(req, res) {
    try {
      const recommendations = await fleetService.suggestTrafficHours();
      res.status(200).json(recommendations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new FleetController();