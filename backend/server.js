import app from './app.js';
import { PORT } from '../backend/src/config/env.js';

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});