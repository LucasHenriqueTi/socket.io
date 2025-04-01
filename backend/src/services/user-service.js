import {createUser, getUserById, getAllUsers, deleteAllUsers} from '../repositories/user-repository.js';

// criar um usuário
const registerUser = async (name) => {
    return createUser(name);
}

// obter todos os usuários
const getAllUser = async () => {
    return await getAllUsers();
}

// obter um usuário
const getUserId = async (userId) => {
    return await getUserById(userId);
}

// deleta todos os usuários 
const deleteUsers = async () => {
    return await deleteAllUsers();
}

export {registerUser, getUserId, getAllUser, deleteUsers};