import {Server} from 'socket.io';
import sharedFormHandlers from '../router/websocket/shared-form.ws.js';

const configureSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
            methods: ["GET", "POST"]
        }
    });

    const onConnection = (socket) => {
        console.log(`Novo cliente conectado: ${socket.id}`);
        sharedFormHandlers(io, socket);
    };

    io.on('connection', onConnection); // Evento padrão é 'connection' (minúsculo)

    return io;
};

export default configureSocket;