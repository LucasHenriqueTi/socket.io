import { Server } from 'socket.io';

// Configuração do Socket.IO
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

  // Evento de conexão
  io.on('connection', (socket) => {
    console.log(`Usuário ${socket.userId} conectado: ${socket.id}`);

    // Room privada para o usuário
    socket.join(`user_${socket.userId}`); 

    // Evento de compartilhamento de documento
    socket.on('share-document', ({documentId, recipientId}) => {
      const recipientSocket = [...io.sockets.sockets.values()]
      .find(s => s.userId === recipientId);

      // Verifica se o destinatário está conectado
      if (recipientSocket) {
        io.to(`user_${recipientId}`).emit('document-shared', {
          senderId: socket.userId,
          documentId,
          message: `O usuário ${socket.userId} compartilhou o documento ${documentId}`,
          timestamp: new Date().toISOString()
        });
        console.log(`Documento ${documentId} compartilhado com usuário ${recipientId}`);
      } else {
        // Aqui você pode armazenar a notificação no banco de dados para quando o usuário se conectar
        console.log(`Usuário ${recipientId} está offline. Notificação será enviada quando ele se conectar.`);
      }
    });
  
    // Evento para reconhecer reconexões
    socket.on('reconnect_attempt', () => {
      console.log(`Tentativa de reconexão do usuário ${socket.userId}`);
    });

    // Evento para lidar com disconexões
    socket.on('disconnect', () => {
      console.log(`Usuário ${socket.userId} desconectado`);
    });
  });

  return io;
};

export default configureSocket;