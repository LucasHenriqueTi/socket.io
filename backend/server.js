import app from './app.js';
import { PORT } from '../backend/src/config/env.js';
import http from 'http';
import configureSocket from './src/config/socket.js';
import NotificationService from './src/services/notification-service.js';

const server = http.createServer(app);

// Configuração do Socket.io com CORS específico
const io = configureSocket(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Inicializa o serviço de notificação
const notificationService = new NotificationService(io);

server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});