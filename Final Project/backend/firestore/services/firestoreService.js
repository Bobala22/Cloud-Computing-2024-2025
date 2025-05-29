// firestore-service/services/firestoreService.js
const { db, admin } = require('../firebase-config');
const { client } = require('../big-query-config'); // Ensure this matches your file name
const Car = require('../models/car');
const Maintenance = require('../models/maintenance');

class FirestoreService {
  async addCar(carData) {
    const car = new Car(carData);
    const carRef = db.collection('cars').doc();
    await carRef.set({ ...car });

    const bqCar = {
      id: carRef.id,
      make: car.make,
      model: car.model,
      year: car.year,
      fuel_type: car.fuel_type,
      license_plate: car.license_plate,
      co2_emission_rate: car.co2_emission_rate,
      total_mileage: car.total_mileage || 0,
      current_location_lat: car.current_location?.lat || null,
      current_location_lng: car.current_location?.lng || null,
    };
    console.log('Inserting into BigQuery:', bqCar);
    try {
      await client
        .dataset('fleet_management')
        .table('cars_data')
        .insert([bqCar]);
      console.log('BigQuery insert succeeded');
    } catch (error) {
      console.error('BigQuery insert failed:', error.message);
      throw new Error(`BigQuery insert failed: ${error.message}`);
    }

    return { id: carRef.id, ...car };
  }

  async getAllCars() {
    const snapshot = await db.collection('cars').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async updateCar(id, updates) {
    await db.collection('cars').doc(id).update(updates);
    return { message: 'Car updated' };
  }

  async deleteCar(id) {
    await db.collection('cars').doc(id).delete();
    return { message: 'Car deleted' };
  }

  async addMaintenance(maintenanceData) {
    const maintenance = new Maintenance(maintenanceData);
    const logRef = db.collection('maintenance_logs').doc();
    await logRef.set({ ...maintenance });

    const bqMaintenance = {
      id: logRef.id,
      car_id: maintenance.car_id,
      date: maintenance.date,
      type: maintenance.type,
      cost: maintenance.cost,
      description: maintenance.description,
      next_scheduled: maintenance.next_scheduled || null,
    };
    await client
      .dataset('fleet_management')
      .table('maintenance_logs_data')
      .insert([bqMaintenance]);

    return { id: logRef.id, ...maintenance };
  }

  async updateCarMileageAndLocation(carId, distance, endLocation) {
    try {
      const carRef = db.collection('cars').doc(carId);
      const carDoc = await carRef.get();
      if (!carDoc.exists) {
        throw new Error(`Car with ID ${carId} not found`);
      }

      // Convert endLocation to Firestore GeoPoint
      const geoPoint = new admin.firestore.GeoPoint(endLocation.lat, endLocation.lng);

      // Update Firestore
      await carRef.update({
        total_mileage: admin.firestore.FieldValue.increment(distance),
        current_location: geoPoint,
      });

      // Calculate updated mileage
      //   const currentData = carDoc.data();
      //   const updatedMileage = (currentData.total_mileage || 0) + distance;

      //   // Delete existing row in BigQuery (if it exists)
      //   const deleteQuery = `
      //     DELETE FROM \`${client.projectId}.fleet_management.cars_data\`
      //     WHERE id = '${carId}'
      //   `;
      //   await client.query(deleteQuery);

      //   // Insert updated row into BigQuery
      //   const bqUpdate = {
      //     id: carId,
      //     make: currentData.make,
      //     model: currentData.model,
      //     year: currentData.year,
      //     fuel_type: currentData.fuel_type,
      //     license_plate: currentData.license_plate,
      //     co2_emission_rate: currentData.co2_emission_rate,
      //     total_mileage: updatedMileage,
      //     current_location_lat: endLocation.lat,
      //     current_location_lng: endLocation.lng,
      //   };
      //   await client
      //     .dataset('fleet_management')
      //     .table('cars_data')
      //     .insert([bqUpdate]);

      return { message: 'Car mileage and location updated' };
    } catch (error) {
      console.error('updateCarMileageAndLocation error:', error.message);
      throw new Error(error.message || 'Failed to update car mileage and location');
    }
  }
}

module.exports = new FirestoreService();