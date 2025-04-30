import api from './api';
import Cookie from 'js-cookie';

// Criar um novo usuário
const createUser = (name) =>
    api.post(`/users`, { name }, {
        headers: {
            'Authorization': `Bearer ${Cookie.get('token')}`
        }
    });

// Obter todos os usuários
const getUsers = () =>
    api.get(`/users`, {
        headers: {
            'Authorization': `Bearer ${Cookie.get('token')}`
        }
    });

// Obter um usuário pelo ID
const getUserById = (userId) =>
    api.get(`/users/${userId}`, {
        headers: {
            'Authorization': `Bearer ${Cookie.get('token')}`
        }
    });

// Deleta todos os Usuários 
const deleteAllUsers = () =>
    api.post(`/delete-all`, null,  {
        headers: {
            'Authorization': `Bearer ${Cookie.get('token')}`
        }
    });

export { createUser, getUsers, getUserById, deleteAllUsers };