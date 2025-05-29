import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import maintenanceRouter from './routes/maintenance.routes.js';
import { connectUserDB } from "./config/maintenance.database.js"

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 8080;     

const allowedOrigins = [
  'http://localhost:5173',
  'https://drive-sync-frontend.vercel.app',
];

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) {
        cb(null, true);
      } else {
        cb(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,POST,PUT,DELETE,OPTIONS,PATCH',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  })
);

app.use(bodyParser.json());

connectUserDB();

app.use('/api', maintenanceRouter);

app.listen(PORT, () => {
  console.log(`Maintenance service running on port ${PORT}`);
});