import express from 'express';
const usersRouter = express.Router();
import { body, validationResult } from 'express-validator';
import pool from '../db/pool.js';

const userValidation = [
    body('first_name').isString().notEmpty(),
    body('last_name').isString().notEmpty(),
    body('age').isInt({ min: 1 }),
];

usersRouter.get("/", async (req, res) => {
    try {
        const {rows} = await pool.query('SELECT * FROM users');
        res.json(rows)

    } catch(err){
        res.status(500).json(err)
    }
})


usersRouter.get("/:id", async (req, res) => {
    const {id} = req.params;
    try {
        const {rows} = await pool.query('SELECT * FROM users WHERE id=$1;', [id]);
        res.json(rows[0])

    } catch(err){
        res.status(500).json(err)
    }
})

usersRouter.post("/", userValidation, async (req, res) => {
    const {first_name, last_name, age} = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const {rows} = await pool.query('INSERT INTO users (first_name, last_name, age) VALUES ($1, $2, $3) RETURNING *;', [first_name, last_name, age]);
        res.json(rows[0])

    } catch(err){
        res.status(500).json(err)
    }
})

usersRouter.put("/:id", async (req, res) => {
    const {first_name, last_name} = req.body;
    const {id} = req.params;

    let setClauses = [];
    let values = [];
    
    if (first_name !== undefined) {
        setClauses.push(`first_name = $${values.length + 1}`);
        values.push(first_name);
    }
    
    if (last_name !== undefined) {
        setClauses.push(`last_name = $${values.length + 1}`);
        values.push(last_name);
    }

    if (!setClauses.length) {
        return res.status(400).json({ message: "No fields provided to update" });
    }

    values.push(id);
    
    const query = `UPDATE users SET ${setClauses.join(", ")} WHERE id = $${values.length} RETURNING *`;
    console.log(query, 'query')
    try {
        const {rows} = await pool.query(query, values);
        if (!rows.length) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(rows[0]);
    } catch(err) {
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});


usersRouter.delete("/:id", async (req, res) => {
    const {id} = req.params;
    try {
        const {rows} = await pool.query('DELETE FROM users WHERE id=$1;', [id]);
        res.json({ message: 'User deleted successfully', data: rows[0] });

    } catch(err){
        res.status(500).json(err)
    }
})

usersRouter.get("/:id/orders", async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await pool.query('SELECT * FROM orders WHERE user_id=$1;', [id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});

usersRouter.put("/:id/check-inactive", async (req, res) => {
    const { id } = req.params;
    
    try {
        const orders = await pool.query('SELECT * FROM orders WHERE user_id=$1;', [id]);
        if (orders.rows.length === 0) {
            const { rows } = await pool.query('UPDATE users SET active=false WHERE id=$1 RETURNING *;', [id]);
            res.json(rows[0]);
        } else {
            res.status(400).json({ message: "User has orders, cannot set to inactive" });
        }
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});


export default usersRouter;
