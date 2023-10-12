import express from 'express';
const studentsRouter = express.Router();
import Student from "../models/Student.js";

const middlewareAuthorizationFunction = (req, res, next) => {
    //Perform some action on the request or response
    const {token} = req.body;
    const secretToken = process.env.SECRET_TOKEN;

    if(!token || secretToken !== token){
        res.status(403).json({error: 'Unauthorized'});
    } else {
        next()
    }
}

//studentsRouter.use(middlewareAuthorizationFunction)

studentsRouter.get("/", async (req, res) => {
    try {
      const response = await Student.find();
      res.json(response)

    } catch(err){
        res.status(500).json(err)
    }
})



studentsRouter.post("/", middlewareAuthorizationFunction, async (req, res) => {
    const {name, first_name, email} = req.body;
    try {
      const response = await Student.create({name, first_name, email});
      res.status(201).json(response);

    } catch(err){
        console.log(err)
        if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
            return res.status(400).json({ error: 'Email already exists.' });
        }
        return res.status(500).json(err)
    }
})
const middlewareErrorFunction = (err, req, res, next) => {
    //Perform some action on the request or response
    console.log(err);
    const statusCode = err.statusCode || 500;
    const statusMessage = err.message || "Internal server error";
    res.status(statusCode).json({error: statusMessage})
}

studentsRouter.put('/:name', middlewareAuthorizationFunction, async (req, res, next) => {
        const {newName} = req.body;
        const {name} = req.params;
    try {
        const result = await Student.updateMany({ name }, { name: newName });

        if(result.modifiedCount > 0){
            const updatedDocs = await Student.find({ name: newName });
            res.json(updatedDocs)
        } else {
            //res.status(404).json({message: 'No records match provided criteria'})
            return next({statusCode: 404, message: "No records match provided criteria"})
        }
    } catch (err) {
        console.log(err)
        return next()

    }
}, middlewareErrorFunction);

studentsRouter.put("/oneUser/:id", async (req, res) => {
    const {name, first_name, email} = req.body;
    const {id} = req.params;
    try {
        const result = await Student.findByIdAndUpdate(id, { name, first_name, email }, {new: true} );
        if(!result) {
            res.status(404).json({message: "The resource does not exist"})
          }
          res.json(result)

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

studentsRouter.delete("/:id", async (req, res) => {
    const {id} = req.params;
    try {
        const result = await Student.findByIdAndDelete(id);
        console.log(result, 'result')
        if (!result) {
            return res.status(404).json({ message: "The resource does not exist" });
        } else {
            res.json(result);
        }
        
    } catch(err){
        console.log(err)
        res.status(500).json(err)
    }
})





export default studentsRouter;