// bigquery-service/index.js
const express = require('express');
const app = express();
const routes = require('./routes/index');

app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`BigQuery Service running on port ${PORT}`);
});