import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import sync from './Controllers/sync.js'
import admin from './Routes/admin.js'
import car from './Routes/car.js'
import cookieParser from 'cookie-parser';
import settings from './Routes/settings.js';
import home from './Routes/home.js';
import carlisting from "./Routes/carlisting.js"
import testdrive from "./Routes/testdrive.js"

const app = express();
const port = process.env.PORT || 3000;
app.use(cors())


app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(cookieParser());
app.use("/api/user", sync);
app.use("/api/admin", admin);
app.use("/api/car", car);
app.use("/api/settings", settings);
app.use("/api", home);
app.use("/api", carlisting);
app.use("/api", testdrive);


app.listen(port, () =>
    console.log('Server running at http://localhost:3000'
    ));


