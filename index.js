import express from 'express';
import 'dotenv/config';
import client from './db/db.js';
import filmsRouter from './routes/films.js';


const app = express();
app.use(express.json());
app.use('/api/films', filmsRouter);

const port = process.env.PORT || 8080;

client.on('connected', () => {
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`)
    })
})

