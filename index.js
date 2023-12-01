// const express = require('express');
require("dotenv").config();
// const { createServer } = require('node:http');
const mongoose = require('mongoose');
const cors = require("cors");
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
// const app = express();
const { socketIO} = require("./socket/socketio");
const { connection } = require("./socket/handler");
const socketAuth = require("./middleware/socketAuth");
const {app,server, socketManager} = require('./socket/socketio');
// create http server
// const server = createServer(app);
// const io = socketIO(server);
// const socketManager = new SocketManager(server)

app.use(cors());
// Configure body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Include user registration routes
const userRoutes = require('./routes/userRoutes');
const mpesaRoutes = require('./routes/mpesaRoutes');
const { createBots, botplay } = require('./populateBots');

app.use('/api/user', userRoutes);
app.use("/api/v1/callback", mpesaRoutes);

// io.on('connection', (socket) => {
//     console.log('a user connected');
//   });

// socketio initialization and connection check


const onConnection = (socket) => {
  connection(socketManager.io, socket);
};
socketManager.use(socketAuth);
// Apply middleware to the io instance
socketManager.applyMiddleware();

socketManager.io.on("connection", onConnection);
// io.use(socketAuth);

createBots();
botplay(socketManager.io);
// Start the server
server.listen(process.env.APP_PORT, () => {
    // mongoose connection
    mongoose
        .connect(
            process.env.MONGO_URI || //use this if using mongodb remote
            `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PWD}@127.0.0.1:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=Admin`
        )
        .then((conn) => {
            // Access the host and database name from the connection object
            const host = conn.connections[0].host;
            const dbName = conn.connections[0].name;

            console.log(`Connected to MongoDB on host: ${host}, database: ${dbName}`);
        })
        .catch((err) => console.log(err));
    // end mongoose connection
    console.log(`listening on *:${process.env.APP_PORT}`);
    
});
