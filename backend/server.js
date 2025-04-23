import app from './app.js';
import { PORT } from '../backend/src/config/env.js';
import http from 'http';
import configureSocket from './src/config/socket.js';

const server = http.createServer(app);

// Configuração do Socket.IO com tratamento de erros
try {
  const io = configureSocket(server);
  
  server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`WebSocket disponível em ws://localhost:${PORT}/socket.io`);
  });
  
  server.on('error', (error) => {
    console.error('Erro no servidor:', error);
  });
} catch (error) {
  console.error('Falha ao configurar Socket.IO:', error);
}