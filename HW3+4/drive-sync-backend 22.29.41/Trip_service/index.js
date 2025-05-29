const express = require('express');
const routes = require('./routes');
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8080;
const allowedOrigins = [
  'http://localhost:5173',
  'https://car-management-app-cloud-comput-production.up.railway.app',
  'https://drive-sync-frontend.vercel.app'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log("Blocked origin:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization"
}));


app.use(express.json());
app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Trip Service running on port ${PORT}`);
});

module.exports = app; 