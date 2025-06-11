import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import sync from './Controllers/sync.js'
import admin from './Routes/admin.js'
import car from './Routes/car.js'
import cookieParser from 'cookie-parser';
const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))


app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(cookieParser());
app.use("/api/user", sync);
app.use("/api/admin", admin);
app.use("/api/car", car);

app.listen(3000, () =>
    console.log('Server running at http://localhost:3000'
    ));


