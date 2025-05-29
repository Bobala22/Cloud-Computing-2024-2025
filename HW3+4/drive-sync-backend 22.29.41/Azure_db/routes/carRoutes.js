const express = require('express');
const {
    createCarController,
    getAllCarsController,
    getCarByIdController,
    updateCarController,
    deleteCarController,
} = require('../controllers/carController');

const router = express.Router();

router.post('/', createCarController);
router.get('/', getAllCarsController);
router.get('/:id', getCarByIdController);
router.put('/:id', updateCarController);
router.delete('/:id', deleteCarController);

module.exports = router;