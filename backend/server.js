import app from './app.js';
import { PORT } from '../backend/src/config/env.js';
import http from 'http';
import configureSocket  from './src/config/socket.js';
import NotificationService from './src/services/notification-service.js'


const server = http.createServer(app);
const io = configureSocket(server);

// Inicializa o serviço de notificação
const notificationService = new NotificationService(io);



server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});