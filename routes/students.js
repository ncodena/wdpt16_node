import express from 'express';
const studentsRouter = express.Router();
import Student from "../models/Student.js";

studentsRouter.get("/", async (req, res) => {
    try {
      const response = await Student.find();
      res.json(response)

    } catch(err){
        res.status(500).json(err)
    }
})


studentsRouter.get("/:id", async (req, res) => {
    const {id} = req.params;
    try {
      const response = await Student.findById(id);
      if(!response) {
        res.status(404).json({message: "The resource does not exist"})
      }
      res.json(response)

    } catch(err){
        res.status(500).json(err)
    }
})


export default studentsRouter;