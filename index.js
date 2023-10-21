import express from 'express';
import 'dotenv/config';
import client from './db/db.js';
import filmsRouter from './routes/films.js';
import studentsRouter from './routes/students.js';
import authRouter from './routes/auth.js';
import cors from 'cors';

const app = express();

app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Origin", "Access-Control-Allow-Credentials"],
      credentials: true,
    })
)
app.use(express.json());

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

app.use('/api/films', filmsRouter);
app.use('/api/students', studentsRouter);
app.use('/api/auth', authRouter);



const port = process.env.PORT || 8080;

client.on('connected', () => {
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`)
    })
})

