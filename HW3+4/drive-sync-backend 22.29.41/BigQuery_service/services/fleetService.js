// bigquery-service/services/fleetService.js
const { client } = require('../config');

class FleetService {
  constructor() {
    this.datasetId = 'fleet_management';
  }

  // Query BigQuery table
  async queryBigQuery(query) {
    const options = { query, location: 'US' };
    const [rows] = await client.query(options);
    return rows;
  }

  // Create or update a predictive model for fuel consumption
  async trainFuelModel() {
    const query = `
      CREATE OR REPLACE MODEL \`${this.datasetId}.fuel_efficiency_model\`
      OPTIONS(model_type='linear_reg', input_label_cols=['fuel_consumption'])
      AS
      SELECT
        t.data.distance,
        t.data.traffic_hours,
        c.data.fuel_type,
        c.data.total_mileage,
        t.data.fuel_consumption
      FROM \`${this.datasetId}.trips_data_raw_latest\` t
      JOIN \`${this.datasetId}.cars_data_raw_latest\` c
      ON t.data.car_id = c.data.id
    `;
    await this.queryBigQuery(query);
    console.log('Fuel efficiency model trained');
  }

  // Predict fuel consumption for a given trip
  async predictFuelConsumption(tripData) {
    const query = `
      SELECT
        predicted_fuel_consumption
      FROM
        ML.PREDICT(
          MODEL \`${this.datasetId}.fuel_efficiency_model\`,
          (
            SELECT
              ${tripData.distance} AS distance,
              ${tripData.trafficHours} AS traffic_hours,
              '${tripData.fuelType}' AS fuel_type,
              ${tripData.totalMileage} AS total_mileage
          )
        )
    `;
    const [result] = await this.queryBigQuery(query);
    return result[0].predicted_fuel_consumption;
  }

  // Analyze trips for route improvements
  async suggestRouteImprovements() {
    const query = `
      SELECT
        t.data.car_id,
        c.data.make,
        c.data.model,
        c.data.fuel_type,
        t.data.start_location.lat AS start_lat,
        t.data.start_location.lng AS start_lng,
        t.data.end_location.lat AS end_lat,
        t.data.end_location.lng AS end_lng,
        t.data.distance,
        t.data.fuel_consumption,
        t.data.traffic_hours,
        (t.data.distance / t.data.fuel_consumption) AS fuel_efficiency,
        CASE
          WHEN t.data.traffic_hours > 0.5 AND c.data.fuel_type = 'gasoline' THEN 'Reroute to avoid traffic or use hybrid/electric'
          WHEN t.data.fuel_consumption > (SELECT AVG(data.fuel_consumption) FROM \`${this.datasetId}.trips_data_raw_latest\`) THEN 'Shorten route distance'
          ELSE 'Route is efficient'
        END AS recommendation
      FROM \`${this.datasetId}.trips_data_raw_latest\` t
      JOIN \`${this.datasetId}.cars_data_raw_latest\` c
      ON t.data.car_id = c.data.id
    `;
    return await this.queryBigQuery(query);
  }

  // Get traffic hour recommendations
  async suggestTrafficHours() {
    const query = `
      SELECT
        t.data.car_id,
        c.data.fuel_type,
        EXTRACT(HOUR FROM TIMESTAMP(t.data.start_time)) AS start_hour,
        AVG(t.data.traffic_hours) AS avg_traffic_hours,
        AVG(t.data.fuel_consumption) AS avg_fuel_consumption,
        CASE
          WHEN AVG(t.data.traffic_hours) > 0.5 THEN 'Shift to off-peak hours (e.g., 6-9 AM or 8-11 PM)'
          ELSE 'Current hours are optimal'
        END AS traffic_recommendation
      FROM \`${this.datasetId}.trips_data_raw_latest\` t
      JOIN \`${this.datasetId}.cars_data_raw_latest\` c
      ON t.data.car_id = c.data.id
      GROUP BY
        t.data.car_id,
        c.data.fuel_type,
        EXTRACT(HOUR FROM TIMESTAMP(t.data.start_time))
      ORDER BY
        avg_traffic_hours DESC
    `;
    return await this.queryBigQuery(query);
  }
}

module.exports = new FleetService();