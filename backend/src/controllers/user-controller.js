import { registerUser, getUserId, getAllUser, deleteUsers } from '../services/user-service.js';

// criar um usuário
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

// obter todos os usuários
const getAllUsers = async (req, res) => {
    try {
        const users = await getAllUser();
        res.status(200).json({ success: true, users });
    }catch (error) {
        res.status(500).json({ success: false, error: 'Erro ao buscar usuários'
    })};
};

// obter um usuário
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

// deleta todos os usuários
const deleteAllUsers = async (req, res) => {
    try {
        const deleteAll = await deleteUsers();
        res.status(202).json({success: true, deleteAll})
    }catch (error) {
        console.error('Erro ao deletar os usuários', error)
        res.status(404).json({success: false, error: 'Erro ao deleter os usuários'});
    }
};

export { createUser, getUserDetails, getAllUsers, deleteAllUsers};