// trip-service/services/tripService.js
const { db, admin } = require('../trip-config');
const { client } = require('../big-query-config'); 
const Trip = require('../models/trip');

class TripService {
  async addTrip(tripData) {
    try {
      if (!db) throw new Error('Firestore DB is undefined');
      const trip = new Trip(tripData);
      const tripRef = db.collection('trips').doc();
      const firestoreTripData = { ...trip }; 

      // Write to Firestore
      await tripRef.set(firestoreTripData);

      // Prepare BigQuery data (flatten GeoPoints)
      // const bqTrip = {
      //   id: tripRef.id,
      //   car_id: trip.car_id,
      //   start_time: trip.start_time,
      //   end_time: trip.end_time,
      //   start_location_lat: trip.start_location.lat,
      //   start_location_lng: trip.start_location.lng,
      //   end_location_lat: trip.end_location.lat,
      //   end_location_lng: trip.end_location.lng,
      //   distance: trip.distance,
      //   fuel_consumption: trip.fuel_consumption,
      //   traffic_hours: trip.traffic_hours,
      //   route: trip.route.map(point => ({ lat: point.lat, lng: point.lng })),
      // };

      // // Write to BigQuery
      // await client
      //   .dataset('fleet_management')
      //   .table('trips_data')
      //   .insert([bqTrip]);

      // Update car mileage in firestore-service (keep existing logic)
      // await this.updateCarMileage(trip.car_id, trip.distance, {
      //   lat: geoTrip.end_location.latitude,
      //   lng: geoTrip.end_location.longitude,
      // });

      return { id: tripRef.id, ...firestoreTripData };
    } catch (error) {
      console.error('TripService error:', error.message);
      throw error;
    }
  }

  // async updateCarMileage(carId, distance, endLocation) {
  //   const axios = require('axios');
  //   await axios.post(
  //     `https://firestore-service-dot-cloud-app-455515.lm.r.appspot.com/api/cars/update-mileage`,
  //     { carId, distance, endLocation }
  //   ).catch(err => {
  //     console.error('Axios error:', err.message);
  //     throw new Error('Failed to update car mileage');
  //   });
  // }
  async getAllTrips() {
    try {
      if (!db) throw new Error('Firestore DB is undefined');
      const tripsSnapshot = await db.collection('trips').get();
      if (tripsSnapshot.empty) {
        return [];
      }
      const trips = [];
      tripsSnapshot.forEach(doc => {
        trips.push({ id: doc.id, ...doc.data() });
      });
      return trips;
    } catch (error) {
      console.error('TripService error getting all trips:', error.message);
      throw error;
    }
  }
}

module.exports = new TripService();