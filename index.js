import express from 'express';
import filmsRouter from './routers/films.js';

import 'dotenv/config';
const app = express();
app.use(express.json());
app.use('/api/films', filmsRouter);


// app.get("/time", (req, res) => {
//     pool.query('SELECT NOW(')
//         .then(({rows}) => res.json(rows[0]))
//         .catch(err => res.status(500).json(err))
// })

// app.get("/time", async (req, res) => {
//     try {
//         const {rows} = await pool.query('SELECT NOW()');
//         res.json(rows[0])

//     } catch(err){
//         res.status(500).json(err)
//     }
// })

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})