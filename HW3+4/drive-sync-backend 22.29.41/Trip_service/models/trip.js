// trip-service/models/trip.js
class Trip {
    constructor({
      license_plate,
      longitude,
      latitude,
    }) {
      this.license_plate = license_plate;
      this.longitude = longitude;
      this.latitude = latitude;
    }
  }
  
module.exports = Trip;