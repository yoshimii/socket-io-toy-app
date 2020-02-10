const axios = require('axios');
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const router = express.Router()
const cors = require('cors');

//Port from environment variable or default - 4001
const port = process.env.PORT || 5000;


const app = express();
app.use(cors());
const server = http.createServer(app);

//Setting up express and adding socketIo middleware
const io = socketIo(server);

router.get("/", (req, res) => {
    res.send({ response: "I am alive" }).status(200);
});

// listens for connection to socket from front end then sends data from client to all clients in chat
io.on("connection", socket => {
    socket.on("Chat", data => {
        socket.broadcast.emit("message", {message: data})
    })

})

//Setting up a socket with the namespace "connection" for new sockets
io.on("connection", socket => {
    console.log("New client connected");
    
    //Here we listen on a new namespace called "incoming data"
    socket.on("incoming data", (data)=>{
        //Here we broadcast it out to all other sockets EXCLUDING the socket which sent us the data
        socket.broadcast.emit("outgoing data", {num: data});
    });
    
    //A special namespace "disconnect" for when a client disconnects
    socket.on("disconnect", () => console.log("Client disconnected"));
});

server.listen(port, () => console.log(`***Listening on port ${port}***`));


// listens for connection to socket from front end then sends api data to all clients (reacct app)
const getApiAndEmit = async socket => {
    try {
        const res = await axios.get(
            "https://api.darksky.net/forecast/eba5b350a14399b7c38eb03a85ceb030/43.7695,11.2558"
            ); // Getting the data from DarkSky
            socket.emit("FromAPI", res.data.currently.temperature); // Emitting a new message. It will be consumed by the client
        } catch (error) {
            console.error(`Error: ${error.code}`);
        }
    };
    
    let interval;
    
    io.on("connection", socket => {
        console.log("Emma is online.");
  if (interval) {
      clearInterval(interval);
    }
    interval = setInterval(() => getApiAndEmit(socket), 10000);
    
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});
