import express from 'express';
import cors from 'cors';
import router from './src/router/index.js'; 


const app = express();

// Configuração detalhada do CORS
const corsOptions = {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middlewares
app.use(cors(corsOptions)); // Aplica a todas as rotas HTTP
app.use(express.json());

// Rotas
app.use('/api', router);

export default app;