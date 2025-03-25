import api from './api';

// Criar um novo usuário
const createUser = (userData) => 
    api.post(`/users`, userData);

// Obter todos os usuários
const getUsers = () => 
    api.get(`/users`);

// Obter um usuário pelo ID
const getUserById = (userId) => 
    api.get(`/users/${userId}`);

export default { createUser, getUsers, getUserById };