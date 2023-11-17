import express from 'express';
import 'dotenv/config';
import client from './db/db.js';
import filmsRouter from './routes/films.js';
import studentsRouter from './routes/students.js';
import authRouter from './routes/auth.js';
import restaurantsRouter from './routes/restaurants.js';
import cors from 'cors';
import initializeSocket from './db/socket.js'; // Import your Socket.io setup
import http from 'http';
import chatRouter from './routes/chat.js';


const app = express();
const server = http.createServer(app); // Create an HTTP server using Express app

// Initialize Socket.io with the server
const io = initializeSocket(server);
app.use(
    cors({
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Access-Control-Allow-Origin',
        'Access-Control-Allow-Credentials',
      ],
      credentials: true,
    })
  );
app.use(express.json());

// Middleware to parse form data
//app.use(express.urlencoded({ extended: true }));

app.use('/api/films', filmsRouter);
app.use('/api/students', studentsRouter);
app.use('/api/auth', authRouter);
app.use('/api/restaurants', restaurantsRouter);
app.use('/api/chat', chatRouter);
const port = process.env.PORT || 8080;

client.on('connected', () => {
    server.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
});

