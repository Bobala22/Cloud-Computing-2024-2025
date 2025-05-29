const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 8080;

const FIRESTORE_URL = 'https://firestore-service-dot-cloud-app-455515.lm.r.appspot.com/api/cars';

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/api/maps', async (req, res) => {
  try {
    const response = await axios.get(FIRESTORE_URL);
    const firestoreCars = response.data;

    if (!firestoreCars || !Array.isArray(firestoreCars)) { // Ensure it's an array
        throw new Error('No data or invalid data format received from Firestore service');
    }

    const formattedCarData = firestoreCars.map(carFromFirestore => {
      const year = parseInt(carFromFirestore.year, 10);
      const co2EmissionRate = parseFloat(carFromFirestore.co2_emission_rate);
      const totalMileage = parseFloat(carFromFirestore.total_mileage);

      const rawLat = carFromFirestore.latitude;
      const rawLng = carFromFirestore.longitude;
      const parsedLat = parseFloat(rawLat);
      const parsedLng = parseFloat(rawLng);

      return {
        company_id: carFromFirestore.company_id || 'N/A',
        make: carFromFirestore.make || 'N/A',
        model: carFromFirestore.model || 'N/A',
        year: !isNaN(year) ? year : null,
        fuel_type: carFromFirestore.fuel_type || 'N/A',
        license_plate: carFromFirestore.license_plate, 
        co2_emission_rate: !isNaN(co2EmissionRate) ? co2EmissionRate : null,
        latitude: !isNaN(parsedLat) ? parsedLat : null,    
        longitude: !isNaN(parsedLng) ? parsedLng : null,   
        status: (carFromFirestore.status && carFromFirestore.status.trim() !== '')
                  ? carFromFirestore.status.trim().toLowerCase()
                  : 'active', // Default 'active' (from your Car class)
        total_mileage: !isNaN(totalMileage) ? totalMileage : 0, // Default 0 (from your Car class)
      };
    }).filter(car => car.latitude !== null && car.longitude !== null); // Filter out cars with no valid location

    res.json(formattedCarData);
  } catch (error) {
    console.error('Failed to fetch or process car data:', error);
    if (error.response) {
      console.error('Error data:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
      res.status(error.response.status).json({ message: 'Failed to retrieve car data from external service', error: error.response.data });
    } else if (error.request) {
      console.error('Error request:', error.request);
      res.status(503).json({ message: 'No response from external car data service', error: 'Service Unavailable' });
    } else {
      console.error('Error message:', error.message);
      res.status(500).json({ message: 'Failed to process car data request', error: error.message });
    }
  }
});

console.log(`Attempting to run on PORT: ${PORT}`);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`API endpoint for car locations: http://localhost:${PORT}/api/maps`);
});