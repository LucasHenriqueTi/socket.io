import { Server } from 'socket.io';
import sharedFormHandlers from '../router/websocket/shared-form.ws.js';

const configureSocket = (server, options) => {
    const io = new Server(server, options); 

    const onConnection = (socket) => {
        console.log(`Novo cliente conectado: ${socket.id}`);
        sharedFormHandlers(io, socket);
    };

    io.on('connection', onConnection);

    return io;
};

export default configureSocket;