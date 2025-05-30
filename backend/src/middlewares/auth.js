import jwt from 'jsonwebtoken';
import { getAllUser } from '../services/user-service.js'; // ou ajuste conforme sua lógica

const login = async (req, res) => {
  const { name } = req.body;

  // Verifica se o nome foi fornecido
  try {
    const users = await getAllUser(); 
    const user = users.find(u => u.name === name);

    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    // Verifica se o usuário já está logado
    const token = jwt.sign(
      { id: user.id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({ user: { id: user.id, name: user.name }, token });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ message: 'Erro no servidor' });
  }
};

// Middleware para autenticação
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  // Verifica se o token é válido
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

export { login, authenticate };
