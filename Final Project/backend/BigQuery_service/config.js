// bigquery-service/config/db.js
const { BigQuery } = require('@google-cloud/bigquery');

const client = new BigQuery({
  projectId: 'cloud-app-455515', 
});

module.exports = { client };