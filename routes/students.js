import express from 'express';
const studentsRouter = express.Router();
import Student from "../models/Student.js";
import Token from '../models/Token.js';

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

const middlewareErrorFunction = (err, req, res, next) => {
    //Perform some action on the request or response
    console.log(err);
    const statusCode = err.statusCode || 500;
    const statusMessage = err.message || "Internal server error";
    res.status(statusCode).json({error: statusMessage})
}

studentsRouter.post("/", async (req, res) => {
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

const secure = (req, res, next) => {
    const token = req.params.token;
    if(token && token.length > 3){
        next()
    } else {
        next({statusCode: 403, message: "Forbidden"})
    }
}

studentsRouter.post("/create-token/:userId", async (req, res, next) => {
    console.log('hey there')
    try{
        const {tokenData} = req.body
        //Save a token document to the db
        const token = await Token.create({value: tokenData});
        const {userId} = req.params;
        //Update student document with tokenId value from the previous creation of the token
        const student = await Student.findByIdAndUpdate(userId, {tokenId: token._id}, {new: true});
        //If no student is found with the given ID, an error is thrown
        if(!student) return next({statusCode: 404, message: "User not found"})
        //Otherwise we send the student
        res.send(student)
    } catch(err){
        next()
    }
}, middlewareErrorFunction)

studentsRouter.get("/verify/:token", secure, async (req, res, next) => {
    try {
     //Check if the token is available in the database
    const token = await Token.findOne({value: req.params.token});
    if(!token) return next({statusCode: 401, message: "Invalid token!"})
    //Check if the token is available on a user
    const student = await Student.findOne({tokenId: token._id});
    if(!student) return next({statusCode: 401, message: "Invalid token!"})
    //if the user is linked to this tokemn
    res.send("token valid");
    } catch(err){
        console.log(err)
        next()
    }
}, middlewareErrorFunction)

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