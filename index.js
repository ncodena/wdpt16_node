import {createServer} from 'http';
//http://localhost:8080/
const server = createServer((req, res) => {

    console.log(req.url, 'req')
    console.log(req.method, 'method')
    if(req.url === "/testRoute"){
        res.setHeader("Content-Type", "application/json");
        res.writeHead(200);
    
        const data = {
            message: "this is testRoute",
            timestamp: new Date().toISOString()
        }
      const jsonData = JSON.stringify(data);
      res.end(jsonData);
    } else if(req.url === "/"){
        res.setHeader("Content-Type", "application/json");
        res.writeHead(200);
    
        const data = {
            message: "this is root",
            timestamp: new Date().toISOString()
        }
        const jsonData = JSON.stringify(data);
        res.end(jsonData);
    } else {
        res.setHeader("Content-Type", "application/json");
        res.writeHead(404);
    
        const data = {
            message: "this resource does not exist",
            timestamp: new Date().toISOString()
        }
        const jsonData = JSON.stringify(data);
        res.end(jsonData);
    }
   
});
const PORT = 8080 || process.env.PORT;
server.listen((PORT), () => {
    console.log(`Server running on: ${PORT}`)
});
server.on("error", (error) => {
    console.log(error)
})

// const http = require('http');

// const requestListener = function (req, res) {
    //res.setHeader("Content-Type", "application/json");

//   res.writeHead(200);
//   const data = {
//     message: "Hello world",
//     timestamp: new Date().toISOString()
//   }
//   const jsonData = JSON.stringify(data);
//   res.end(jsonData);
// }

// const server = http.createServer(requestListener);
// server.listen(8080);