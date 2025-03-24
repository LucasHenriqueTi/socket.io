import {createUser, getUserById} from '../repositories/user-repository.js';

// criar um usuário
const registerUser = async (name) => {
    return createUser(name);
}

// obter um usuário
const getUserId = async (userId) => {
    return await getUserById(userId);
}

export {registerUser, getUserId};