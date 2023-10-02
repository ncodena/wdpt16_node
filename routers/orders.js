import express from 'express';
const ordersRouter = express.Router();
import pool from '../db/pool.js';

ordersRouter.get("/", async (req, res) => {
    try {
        const {rows} = await pool.query('SELECT * FROM orders');
        res.json(rows)

    } catch(err){
        res.status(500).json(err)
    }
})


ordersRouter.get("/:id", async (req, res) => {
    const {id} = req.params;
    try {
        const {rows} = await pool.query('SELECT * FROM orders WHERE id=$1;', [id]);
        res.json(rows[0])

    } catch(err){
        res.status(500).json(err)
    }
})

ordersRouter.post("/", async (req, res) => {
    const {price, date, user_id} = req.body;
    try {
        const {rows} = await pool.query('INSERT INTO orders (price, date, user_id) VALUES ($1, $2, $3) RETURNING *;', [price, date, user_id]);
        res.json(rows[0])

    } catch(err){
        res.status(500).json(err)
    }
})

ordersRouter.put("/:id", async (req, res) => {
    const {price} = req.body;
    const {id} = req.params;
    try {
        const {rows} = await pool.query('UPDATE orders SET price=$1 WHERE id=$2 RETURNING *;', [price, id]);
        res.json(rows[0])

    } catch(err){
        res.status(500).json(err)
    }
})


ordersRouter.delete("/:id", async (req, res) => {
    const {id} = req.params;
    try {
        const {rows} = await pool.query('DELETE FROM orders WHERE id=$1;', [id]);
        res.json({ message: 'Order deleted successfully'});

    } catch(err){
        res.status(500).json(err)
    }
})

export default ordersRouter;
