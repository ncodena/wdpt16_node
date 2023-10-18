import express from 'express';
const studentsRouter = express.Router();
import Student from "../models/Student.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const secret = process.env.SECRET_TOKEN;

const generateToken = (data) => {
  return jwt.sign(data, secret, {expiresIn: '1800s'})
}

const middlewareAuthorizationFunction = (req, res, next) => {
    //Get token from header
    const token = req.headers.authorization;
    
    if(!token){
        return res.sendStatus(401)
    }

    const tokenData = token.split(' ')[1];
    console.log(tokenData)

    //Verify token
    jwt.verify(tokenData, secret, (err, user) => {
        if(err){
            return res.sendStatus(401)
        }
        req.user = user;
        next();
    })
}

studentsRouter.get("/", middlewareAuthorizationFunction, async (req, res) => {
    try {
      const response = await Student.find();
      res.json(response)

    } catch(err){
        res.status(500).json(err)
    }
})


studentsRouter.post("/register", async (req, res) => {
    const {name, email, password} = req.body;
    try {
        //Hash the password before saving to DB
        const hashedPassword = await bcrypt.hash(password, 10);
        const response = await Student.create({name, email, password: hashedPassword});
        res.status(201).json(response);

    } catch(err){
        return res.status(500).json(err)
    }
})

studentsRouter.post("/login", async (req, res) => {
    const { email, password} = req.body;
    try {
        //Find user in db
        const user = await Student.findOne({email});
        if(!user){
            return res.status(400).send('Invalid credentials');
        }
        //Compare passwords
        const validPassword = await bcrypt.compare(password, user.password)
        if(!validPassword){
            return res.status(400).send('Invalid credentials');
        }
        const token = generateToken({email: user.email});
        res.json({token})


    } catch(err){
        return res.status(500).json(err)
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