import {Server} from "socket.io";
import {NEW_MESSAGE_EVENT, INFO_EVENT, PUBLIC_CHANNEL_ID} from "./constants.js"

const io = new Server(4001);

console.log('CHAT STARTED...');

io.on('connection', (socket) => {
    console.log(`New Client Connected.`);
    socket.emit(INFO_EVENT, 'Welcome to SimpleChat!');
    socket.join(PUBLIC_CHANNEL_ID);

    socket.on(NEW_MESSAGE_EVENT, ({name, message}) => {
        console.log(`[${name}]: ${message}`);
        socket.to(PUBLIC_CHANNEL_ID).emit(NEW_MESSAGE_EVENT, {name, message});
    });
});

