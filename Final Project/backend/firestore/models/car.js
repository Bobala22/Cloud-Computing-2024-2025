class Car {
    constructor({
      company_id,
      make,
      model,
      year,
      fuel_type,
      license_plate,
      co2_emission_rate,
      longitude,
      latitude,
      status = 'active',
      total_mileage = 0,
    }) {
      this.company_id = company_id;
      this.make = make;
      this.model = model;
      this.year = year;
      this.fuel_type = fuel_type;
      this.license_plate = license_plate;
      this.co2_emission_rate = co2_emission_rate;
      this.longitude = longitude;
      this.latitude = latitude;
      this.status = status;
      this.total_mileage = total_mileage;
    }
  }
  
  module.exports = Car;