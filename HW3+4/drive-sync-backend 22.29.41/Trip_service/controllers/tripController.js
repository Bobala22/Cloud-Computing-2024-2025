// trip-service/controllers/tripController.js
const tripService = require('../services/tripService');

class TripController {
  async addTrip(req, res) {
    try {
      const trip = await tripService.addTrip(req.body);
      res.status(201).json(trip);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async getAllTrips(req, res) {
    try {
      const trips = await tripService.getAllTrips();
      res.status(200).json(trips);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new TripController();