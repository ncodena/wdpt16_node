import express from 'express';
const studentsRouter = express.Router();
import Student from "../models/Student.js";
import bcrypt from 'bcrypt';
import { middlewareAuthorizationFunction } from '../middlewares/authMiddleware.js';

studentsRouter.get("/", async (req, res) => {
    try {
      const response = await Student.find();
      res.json(response)

    } catch(err){
        res.status(500).json(err)
    }
})

studentsRouter.get('/user', middlewareAuthorizationFunction, async (req, res) => {
    try {
        const response = await Student.findById(req.user.id)
        console.log(response, "response")

        if(!response){
            return res.status(404).json({ message: `User with id ${id} doesn't exist` })
            
        }
       
        res.status(200).json(response)
        
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: `User with id doesn't exist` })
    }
  });
  

const errorHandler = (err, req, res, next) => {
    console.log('it gets into the middleware')
    console.log(err);
    const statusCode = err.statusCode || 500;
    const statusMessage = err.message || "Internal server error";
    res.status(statusCode).json({ error: statusMessage });
};

studentsRouter.get("/:id", async (req, res, next) => {
    try {
        const {id} = req.params
        const response = await Student.findById(id)
        console.log(response, "response")

        // if(!response){
        //     return res.status(404).json({ message: `User with id ${id} doesn't exist` })
            
        // }
        if(!response){
            return next({statusCode: 404, message: `User with id ${id} doesn't exist`})
        }
        res.status(200).json(response)
        
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: `User with id doesn't exist` })
    }}, errorHandler);

    // studentsRouter.get("/:id", async (req, res) => {
//     const {id} = req.params;
//     try {
//       const response = await Student.findById(id);
//       if(!response) {
//         res.status(404).json({message: "The resource does not exist"})
//       }
//       res.json(response)

//     } catch(err){
//         res.status(500).json(err)
//     }
// })

studentsRouter.put("/:id", async (req, res) => {
    const {id} = req.params;
    const {name, email, password} = req.body;
    try {
        // const getData = await User.findById(id)

        
        const updateFields = {};

        if (name !== undefined) {
            updateFields.name = name;
        }

        if (email !== undefined) {
            updateFields.email = email;
        }


        if (password !== undefined) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateFields.password = hashedPassword;
        }
      
        const response = await Student.findByIdAndUpdate(id, { $set: updateFields }, { new: true });

        if (!response) {
            res.status(404).json({ message: "User not found"  });
        }

        return res.status(201).json(response)
        } catch (err) {
            console.log(err)
            res.status(500).json({ message: "Invalid entry" })
    }
});


export default studentsRouter;