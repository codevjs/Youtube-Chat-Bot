const express  = require('express');
const socketIo = require("socket.io");
const Yt       = require("./modules");

if (process.argv[2] === undefined) {

    throw new Error('link argument is required. try node index.js "<youtube live chat url>"');
}

const url      = process.argv[2]
const yt       = new Yt(url);
const app      = express();
const port     = 8000;
const server   = app.listen(port, () => console.log(`listening on ${port}`));
const io       = socketIo(server, {'transports': ['websocket', 'polling']});

//Whenever someone connects this gets executed
io.on('connection', async (socket) => {

    console.log('a user connected');

    //Whenever someone disconnects this piece of code executed
    socket.on('disconnect', () => {
        console.log('a user disconnected');
    });

    socket.on("selected", selected => {
        io.emit("selected", selected);
    });

    socket.on("bannerShow", value => {
        io.emit("bannerShow", value);
    });
});


yt.fetch(list => {

    io.emit("live_chat", list);
});