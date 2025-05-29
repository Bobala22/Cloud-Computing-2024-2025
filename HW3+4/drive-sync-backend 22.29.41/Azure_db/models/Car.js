const sql = require('mssql');
const config = require('../config/dbConfig');

// Get all cars
async function getAllCars() {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM cars');
        console.log(result);
        return result.recordset;
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
}

// Get a car by ID
async function getCarById(id) {
    const pool = await sql.connect(config);
    const result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM cars WHERE id = @id');
    return result.recordset[0];
}

// Create a new car
async function createCar(carData) {
    const pool = await sql.connect(config);
    const result = await pool.request()
        .input('co2_emission_rate', sql.Decimal(6, 2), carData.co2_emission_rate)
        .input('current_lat', sql.Decimal(9, 6), carData.current_lat)
        .input('current_lng', sql.Decimal(9, 6), carData.current_lng)
        .input('fuel_type', sql.VarChar(50), carData.fuel_type)
        .input('license_plate', sql.VarChar(20), carData.license_plate)
        .input('make', sql.VarChar(50), carData.make)
        .input('model', sql.VarChar(50), carData.model)
        .input('status', sql.VarChar(50), carData.status)
        .input('total_mileage', sql.Int, carData.total_mileage)
        .input('year', sql.Int, carData.year)
        .input('speed', sql.Decimal(5, 2), carData.speed)
        .query(`INSERT INTO cars (co2_emission_rate, current_lat, current_lng, fuel_type, license_plate, make, model, status, total_mileage, year, speed)
                OUTPUT INSERTED.*
                VALUES (@co2_emission_rate, @current_lat, @current_lng, @fuel_type, @license_plate, @make, @model, @status, @total_mileage, @year, @speed)`);
    return result.recordset[0];
}

// Update a car
async function updateCar(id, carData) {
    const pool = await sql.connect(config);
    const result = await pool.request()
        .input('id', sql.Int, id)
        .input('co2_emission_rate', sql.Decimal(6, 2), carData.co2_emission_rate)
        .input('current_lat', sql.Decimal(9, 6), carData.current_lat)
        .input('current_lng', sql.Decimal(9, 6), carData.current_lng)
        .input('fuel_type', sql.VarChar(50), carData.fuel_type)
        .input('license_plate', sql.VarChar(20), carData.license_plate)
        .input('make', sql.VarChar(50), carData.make)
        .input('model', sql.VarChar(50), carData.model)
        .input('status', sql.VarChar(50), carData.status)
        .input('total_mileage', sql.Int, carData.total_mileage)
        .input('year', sql.Int, carData.year)
        .input('speed', sql.Decimal(5, 2), carData.speed)
        .query(`UPDATE cars
                SET co2_emission_rate = @co2_emission_rate, current_lat = @current_lat, current_lng = @current_lng,
                    fuel_type = @fuel_type, license_plate = @license_plate, make = @make, model = @model,
                    status = @status, total_mileage = @total_mileage, year = @year, speed = @speed
                OUTPUT INSERTED.*
                WHERE id = @id`);
    return result.recordset[0];
}

// Delete a car
async function deleteCar(id) {
    const pool = await sql.connect(config);
    const result = await pool.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM cars OUTPUT DELETED.* WHERE id = @id');
    return result.recordset[0];
}

module.exports = {
    getAllCars,
    getCarById,
    createCar,
    updateCar,
    deleteCar,
};