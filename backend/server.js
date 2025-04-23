import app from './app.js';
import { PORT } from '../backend/src/config/env.js';
import http from 'http';
import configureSocket from './src/config/socket.js';

const server = http.createServer(app);
const io = configureSocket(server);
  

  server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
  
