const express  = require('express');
const socketIo = require("socket.io");
const Yt       = require("./module/ytlivechat");

const url      = "https://www.youtube.com/live_chat?is_popout=1&v=h8f0tnt7je4" // ganti dengan url popup live chat
const yt       =  new Yt(url);
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
});

(async () => {
    await yt.fetch(list => {

        io.emit("live_chat", list);
    });
})()