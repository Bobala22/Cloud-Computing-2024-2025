// models/dataModel.js
const admin = require('firebase-admin');
const { BigQuery } = require('@google-cloud/bigquery');
const fs = require('fs');

class DataModel {
  constructor() {
    // Initialize Firebase Admin
    const admin = require('firebase-admin');
    
    admin.initializeApp({
        projectId: 'cloud-app-455515' 
    });
    
    this.db = admin.firestore();

    // Initialize BigQuery
    this.bigquery = new BigQuery();
    this.datasetId = 'fleet_management';
    this.tripsTableId = 'trips_data_manual';
    this.maintenanceTableId = 'maintenance_logs_data_manual';
    this.carsTableId = 'cars_data_manual'; // New table for cars
  }

  // Export Firestore collection to JSON file
  async exportCollection(collectionName, fileName) {
    const snapshot = await this.db.collection(collectionName).get();
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
    return data.length > 0;
  }

  // Load JSON file into BigQuery
  async loadToBigQuery(fileName, tableId) {
    const metadata = {
      sourceFormat: 'NEWLINE_DELIMITED_JSON',
      schema: { autodetect: true },
      writeDisposition: 'WRITE_TRUNCATE', // Overwrite table if exists
    };

    const [job] = await this.bigquery
      .dataset(this.datasetId)
      .table(tableId)
      .load(fileName, metadata);

    return job.id;
  }

  // Getters for table IDs
  getTripsTableId() {
    return this.tripsTableId;
  }

  getMaintenanceTableId() {
    return this.maintenanceTableId;
  }

  getCarsTableId() {
    return this.carsTableId;
  }
}

module.exports = DataModel;