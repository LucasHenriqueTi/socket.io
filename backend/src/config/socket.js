import { Server } from 'socket.io';

const configureSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true
    },
    connectionStateRecovery: {
      maxDisconnectionDuration: 120000 // 2 minutos para tentar recuperar sessão
    }
  });

  // DEBUG: Monitora conexões ativas
  console.log('[Socket] Iniciando servidor Socket.IO');

  const activeConnections = new Map();

  io.use(async (socket, next) => {
  try {
    const userId = socket.handshake.auth.userId;
    if (!userId) {
      console.warn('Conexão rejeitada: sem userId');
      return next(new Error('Não autenticado'));
    }

    // Verifica conexões existentes
    const sockets = await io.in(`user_${userId}`).fetchSockets();
    sockets.forEach(s => {
      if (s.id !== socket.id) {
        console.log(`Desconectando socket duplicado: ${s.id}`);
        s.disconnect();
      }
    });

    socket.userId = userId;
    next();
  } catch (error) {
    console.error('Erro no middleware:', error);
    next(error);
  }
});
      
  

  io.on('connection', (socket) => {
    console.log(`[Socket] Conexão estabelecida - Usuário: ${socket.userId}, SocketID: ${socket.id}`);
    console.log(`[Socket] Conexões ativas: ${activeConnections.size}`);
    
    socket.join(`user_${socket.userId}`);
    console.log(`[Socket] Usuário ${socket.userId} entrou na room user_${socket.userId}`);

    // Handler para compartilhar formulário
    socket.on('share-form', async ({ formId, recipientId }, callback) => {
      try {
        console.log(`[Socket] Evento share-form recebido - FormID: ${formId}, RecipientID: ${recipientId}`);
        
        if (!formId || !recipientId) {
          const errorMsg = 'Dados incompletos para compartilhamento';
          console.warn(`[Socket] ${errorMsg}`, { formId, recipientId });
          throw new Error(errorMsg);
        }

        // DEBUG: Simulação de validação no banco de dados
        console.log(`[Socket] Validando compartilhamento do form ${formId} para ${recipientId}`);
        const isValid = true; // Substitua pela lógica real

        if (!isValid) {
          const errorMsg = 'Compartilhamento não autorizado';
          console.warn(`[Socket] ${errorMsg}`);
          throw new Error(errorMsg);
        }

        // DEBUG: Verifica se o destinatário está online
        const recipientSocket = [...io.sockets.sockets.values()].find(s => s.userId === recipientId);
        console.log(`[Socket] Destinatário ${recipientId} está ${recipientSocket ? 'online' : 'offline'}`);

        // Cria payload da notificação
        const notification = {
          id: Date.now().toString(),
          senderId: socket.userId,
          formId,
          message: `Novo formulário compartilhado com você!`,
          timestamp: new Date().toISOString()
        };

        // Envia notificação para o destinatário
        io.to(`user_${recipientId}`).emit('form-shared', notification);
        console.log(`[Socket] Notificação enviada para user_${recipientId}`, notification);

        // Confirmação para o remetente
        const successMsg = `Formulário compartilhado com sucesso com o usuário ${recipientId}`;
        console.log(`[Socket] ${successMsg}`);

      } catch (error) {
        console.error('[Socket] Erro no compartilhamento:', error.message, { formId, recipientId });
      }
    });

    // DEBUG: Monitora eventos de desconexão
    socket.on('disconnect', (reason) => {
      console.log(`[Socket] Desconexão - Usuário: ${socket.userId}, Razão: ${reason}`);
      
      if (activeConnections.get(socket.userId) === socket) {
        activeConnections.delete(socket.userId);
        console.log(`[Socket] Conexão removida do mapa ativo para usuário ${socket.userId}`);
      }
      
      console.log(`[Socket] Conexões ativas restantes: ${activeConnections.size}`);
    });

    // DEBUG: Monitora erros de conexão
    socket.on('error', (error) => {
      console.error('[Socket] Erro no socket:', error.message, { userId: socket.userId });
    });
  });

  // DEBUG: Monitora erros no servidor Socket.IO
  io.engine.on('connection_error', (err) => {
    console.error('[Socket] Erro no engine:', {
      code: err.code,
      message: err.message,
      context: err.context
    });
  });

  return io;
};

export default configureSocket;