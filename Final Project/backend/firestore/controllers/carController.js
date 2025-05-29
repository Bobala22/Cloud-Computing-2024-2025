const firestoreService = require('../services/firestoreService');

class CarController {
  async addCar(req, res) {
    try {
      console.log('Received request to add car:', req.body);
      const car = await firestoreService.addCar(req.body);
      res.status(201).json(car);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllCars(req, res) {
    try {
      const cars = await firestoreService.getAllCars();
      res.status(200).json(cars);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateCar(req, res) {
    try {
      const { id } = req.params;
      const result = await firestoreService.updateCar(id, req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteCar(req, res) {
    try {
      const { id } = req.params;
      const result = await firestoreService.deleteCar(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new CarController();