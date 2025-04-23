import { Server } from 'socket.io';

const configureSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: true,
      methods: ['GET', 'POST'],
      credentials: true
    },
    // Configurações críticas:
    path: '/socket.io',
    serveClient: false,
    connectTimeout: 10000,
    pingTimeout: 60000,
    pingInterval: 25000,
    cookie: false,
    transports: ['websocket', 'polling'],
    allowEIO3: false,
    allowUpgrades: true,
    perMessageDeflate: false,
    httpCompression: false
  });

  // Middleware de namespace raiz
  io.of('/').use((socket, next) => {
    console.log('Middleware para namespace raiz');
    next();
  });

  io.of('/').on('connection', (socket) => {
    console.log(`Nova conexão estabelecida: ${socket.id}`);

    // Middleware de pacotes
    socket.use((packet, next) => {
      console.log('Pacote recebido:', packet[0]);
      next();
    });

    // Handlers de erro
    socket.on('error', (error) => {
      console.error(`Erro no socket ${socket.id}:`, error);
    });

    // Seus handlers personalizados
    sharedFormHandlers(io, socket);
  });

  // Debug do engine
  io.engine.on('connection_error', (err) => {
    console.error('Erro no engine:', {
      code: err.code,
      message: err.message,
      context: err.context
    });
  });

  return io;
};

export default configureSocket;