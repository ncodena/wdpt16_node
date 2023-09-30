import express from 'express';
const filmsRouter = express.Router();
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool();

filmsRouter.get("/", async (req, res) => {
    try {
        const {rows} = await pool.query('SELECT * FROM films');
        res.json(rows)

    } catch(err){
        res.status(500).json(err)
    }
})


filmsRouter.get("/:id", async (req, res) => {
    const {id} = req.params;
    try {
        const {rows} = await pool.query('SELECT * FROM films WHERE id=$1;', [id]);
        res.json(rows[0])

    } catch(err){
        res.status(500).json(err)
    }
})

filmsRouter.post("/", async (req, res) => {
    const {name, year, genre} = req.body;
    try {
        const {rows} = await pool.query('INSERT INTO films(name, year, genre) VALUES($1, $2, $3) RETURNING *;', [name, year, genre]);
        res.json(rows[0])

    } catch(err){
        res.status(500).json(err)
    }
})

filmsRouter.put("/:id", async (req, res) => {
    const {name} = req.body;
    const {id} = req.params;
    try {
        const {rows} = await pool.query('UPDATE films SET name=$1 WHERE id=$2 RETURNING *;', [name, id]);
        res.json(rows[0])

    } catch(err){
        res.status(500).json(err)
    }
})


filmsRouter.delete("/:id", async (req, res) => {
    const {id} = req.params;
    try {
        const {rows} = await pool.query('DELETE FROM films WHERE id=$1 RETURNING *;', [id]);
        res.json(rows[0])

    } catch(err){
        res.status(500).json(err)
    }
})

export default filmsRouter;
