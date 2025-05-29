const {
    getAllCars,
    getCarById,
    createCar,
    updateCar,
    deleteCar,
} = require('../models/Car');

async function createCarController(req, res) {
    try {
        const car = await createCar(req.body);
        res.status(201).json(car);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create car' });
    }
}

async function getAllCarsController(req, res) {
    try {
        const cars = await getAllCars();
        res.status(200).json(cars);
    } catch (error) {
        console.error('Error fetching cars:', error);
        res.status(500).json({ 
            error: 'Failed to fetch cars', 
            message: error.message,
            stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack
        });
    }
}

async function getCarByIdController(req, res) {
    try {
        const car = await getCarById(req.params.id);
        if (!car) return res.status(404).json({ error: 'Car not found' });
        res.status(200).json(car);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updateCarController(req, res) {
    try {
        const car = await updateCar(req.params.id, req.body);
        if (!car) return res.status(404).json({ error: 'Car not found' });
        res.status(200).json(car);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function deleteCarController(req, res) {
    try {
        const car = await deleteCar(req.params.id);
        if (!car) return res.status(404).json({ error: 'Car not found' });
        res.status(200).json({ message: 'Car deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createCarController,
    getAllCarsController,
    getCarByIdController,
    updateCarController,
    deleteCarController,
};