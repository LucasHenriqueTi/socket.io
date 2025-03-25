import api from './api';

// Criar um novo usuário
const createUser = (name) => 
    api.post(`/users`, name);

// Obter todos os usuários
const getUsers = () => 
    api.get(`/users`);

// Obter um usuário pelo ID
const getUserById = (userId) => 
    api.get(`/users/${userId}`);

export { createUser, getUsers, getUserById };