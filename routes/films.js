import express from 'express';
const filmsRouter = express.Router();
import Film from '../models/Film.js';

filmsRouter.get("/", async (req, res) => {
    try {
      const response = await Film.find();
      res.json(response)

    } catch(err){
        res.status(500).json(err)
    }
})

filmsRouter.get("/:id", async (req, res) => {
    const {id} = req.params;
    try {
      const response = await Film.findById(id);
      res.json(response)

    } catch(err){
        res.status(500).json(err)
    }
})

filmsRouter.post("/", async (req, res) => {
    try {
        const {name, year, genre} = req.body;
      const response = await Film.create({name, year, genre});
      res.json(response)
    } catch(err){
        res.status(500).json(err)
    }
})


filmsRouter.put("/:id", async (req, res) => {
    try {
        const {name, year, genre} = req.body;
        const {id} = req.params;
        const response = await Film.findByIdAndUpdate(id, {name, year, genre});
        res.json(response)
    } catch(err){
        console.log(err)
        res.status(500).json(err)
    }
})





export default filmsRouter;
