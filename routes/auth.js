import express from 'express';
import Student from "../models/Student.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const authRouter = express.Router();
const secret = process.env.SECRET_TOKEN;


const generateToken = (data) => {
    return jwt.sign(data, secret, {expiresIn: '1800s'})
}

authRouter.post("/register", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
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
        console.log(err)
        return res.status(500).json(err)
    }
})

export default authRouter;