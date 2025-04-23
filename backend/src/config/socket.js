import { Server } from 'socket.io';

const configureSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", 
      credentials: true
    }
  });

  // Middleware de autenticação
  io.use((socket, next) => {
    const userId = socket.handshake.auth.userId;
    if (userId) {
      socket.userId = userId;
      return next();
    }
    next(new Error('Não autenticado'));
  });

  io.on('connection', (socket) => {
    console.log(`Usuário ${socket.userId} conectado: ${socket.id}`);

    // Evento para reconhecer reconexões
    socket.on('reconnect_attempt', () => {
      console.log(`Tentativa de reconexão do usuário ${socket.userId}`);
    });

    socket.on('disconnect', () => {
      console.log(`Usuário ${socket.userId} desconectado`);
    });
  });

  return io;
};

export default configureSocket;