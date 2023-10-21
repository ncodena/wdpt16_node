import express from 'express';
import Student from "../models/Student.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const authRouter = express.Router();
const secret = process.env.SECRET_TOKEN;

const middlewareAuthorizationFunction = (req, res, next) => {
}

const generateToken = (data) => {
    return jwt.sign(data, secret, {expiresIn: '1800s'})
}

// GET /api/auth/login
authRouter.get('/login', (req, res) => {
    //GET /login: that sends an HTML form with two fields
    //The result of this form is sent on POST /connect
    res.send(`
    <form action="/api/auth/connect" method="POST">
        <input type="text" name="username" placeholder="Login username" required>
        <input type="password" name="password" placeholder="Password" required>
        <input type="submit" value="Login">
    </form>
    `)
});

// POST /api/auth/connect
authRouter.post('/connect', async (req, res) => {
    // we check if the username is john and the password doe in the body of the request
    const {username, password} = req.body;
    if(username === "john" && password === "doe"){
        //if true: sign a JWT containing a payload with your super secret key.
        const token = generateToken({user: username});
        //Set the JWT as a header to the response
        res.header("Authorization", 'Bearer ' + token);
        //Send back an HTML form with only one field (token) so that the user can check the validity of its token
        res.send(`
        <form action="/api/auth/checkJWT" method="POST">
            <input type="text" name="token" placeholder="Login token" required>
            <input type="submit" value="Login">
        </form>
        `)
    }

});

// POST /api/auth/checkJWT
authRouter.post('/checkJWT', middlewareAuthorizationFunction, (req, res) => {
});

export default authRouter;