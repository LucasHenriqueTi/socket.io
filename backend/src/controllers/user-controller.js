import { registerUser, getUserId } from '../services/user-service.js';

const createUser = async (req, res) => {
    const { name } = req.body;

    try {
        const user = await registerUser(name);
        res.status(201).json({ success: true, user });
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ success: false, error: 'Erro ao criar usuário' });
    }
};

const getUserDetails = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await getUserId(userId);
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({ success: false, error: 'Erro ao buscar usuário' });
    }
};

export { createUser, getUserDetails };