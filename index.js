import express from 'express';
import 'dotenv/config';
import client from './db/db.js';
import filmsRouter from './routes/films.js';
import studentsRouter from './routes/students.js';

const app = express();
app.use(express.json());
// const middlewareFunction = (req, res, next) => {
//     //Perform some action on the request or response
//     console.log({url: req.originalUrl});
//     next();
// }

//app.use(middlewareFunction)

// const getOnlyMiddleware = (request, response, next) => {
//     if(request.method === 'GET') { // processes the request and calls next if method is GET
//       next();
//     } else {
//      return response.sendStatus(403); // wrong method used, ends req/res cycle with an error message
//     }
// };

// app.use('/path', getOnlyMiddleware);

// app.get("/path", async (req, res) => {
//     try {
//       res.send('hello')
//     } catch(err){
//         res.status(500).json(err)
//     }
// })

const loggerMiddleware = (request, response, next) => {
    console.log('Console logging from the middleware!'); // Logs the string and goes to the next function in the pipeline
    next();								  
};

const myHandlerFunction = (request, response) => response.send(request.method); // Ends the req/res cycle
    
app.get('/', loggerMiddleware, myHandlerFunction);     // The client will see 'get' in the browser
app.post('/', loggerMiddleware, myHandlerFunction);    // The client will see 'post' in the browser
app.put('/', loggerMiddleware, myHandlerFunction);     // The client will see 'put' in the browser
app.delete('/', loggerMiddleware, myHandlerFunction);  // The client will see 'delete' in the browser


app.use('/api/films', filmsRouter);
app.use('/api/students', studentsRouter);

const port = process.env.PORT || 8080;

client.on('connected', () => {
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`)
    })
})

