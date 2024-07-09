// Importing necessary modules
const express = require('express'); // Importing Express framework
const http = require('http'); // Importing HTTP module to create server
const socketio = require('socket.io'); // Importing Socket.io for real-time web socket communication
const path = require('path'); // Importing Path module for handling and transforming file paths

const app = express(); // Creating an Express application
const server = http.createServer(app); // Creating an HTTP server with the Express app
const io = socketio(server); // Initializing a new instance of socket.io by passing the server

app.set('view engine', 'ejs'); // Setting EJS as the templating engine
app.use(express.static(path.join(__dirname, 'public'))); // Serving static files from the 'public' directory

// Handling socket.io connections
io.on("connection", function(socket){
    // Listening for 'send-location' event from a client
    socket.on("send-location", function(data){
        // Broadcasting received location data to all connected clients
        io.emit("receive-location", {id: socket.id, ...data});
    });
    // Handling client disconnection
    socket.on("disconnect", function(){
        // Broadcasting that a user has disconnected
        io.emit("user disconnected", socket.id);
    });
});

// Defining a route for the root URL
app.get('/', (req, res) => {
    res.render("index"); // Rendering 'index.ejs' when the root URL is accessed
});

// Starting the server on port 3000
server.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`); // Logging the server URL
});
