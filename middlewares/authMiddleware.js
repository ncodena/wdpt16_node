import jwt from 'jsonwebtoken';

const secret = process.env.SECRET_TOKEN;

export const middlewareAuthorizationFunction = (req, res, next) => {
    //Get token from header
    const token = req.headers.authorization;
    
    if(!token){
        return res.sendStatus(401)
    }

    const tokenData = token.split(' ')[1];

    //Verify token
    jwt.verify(tokenData, secret, (err, user) => {
        if(err){
            return res.sendStatus(401)
        }
        req.user = user;
        next();
    })
}