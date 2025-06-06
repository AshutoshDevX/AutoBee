import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import sync from './Controllers/sync.js'

const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))


app.use("/api/user", sync)

app.listen(3000, () =>
    console.log('Server running at http://localhost:3000'
    ));
