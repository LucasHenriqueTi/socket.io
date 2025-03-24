import express from 'express';
import cors from 'cors';
import router from './src/router/index.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api', router);

export default app;