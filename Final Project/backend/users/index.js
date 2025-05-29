import express from "express"
import cors from 'cors'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import userRouter from "./routes/user.routes.js"
import authRouter from './routes/auth.routes.js'
import adminRouter from "./routes/admin.routes.js"
import { connectUserDB } from "./config/user.database.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
console.log("test");

const allowedOrigins = [
    'http://localhost:5173',
    'https://drive-sync-frontend.vercel.app'
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true
}));

/**
 * Returns middleware that only parses json and only looks at requests 
 * where the Content-Type header matches the type option.
 */
app.use(bodyParser.json());
connectUserDB();
app.use('/api', userRouter);
app.use('/api', authRouter);
app.use('/api', adminRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
