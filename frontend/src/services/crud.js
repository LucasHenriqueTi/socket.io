import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
console.log("API_URL:", API_URL); // <-- Adicione essa linha para debug


const fetchUsers = async () => {
    try {
        const response = await axios.get(`${API_URL}/users`);
        return response.data;
    } catch (error) {
        console.error("erro ao buscar usuarios", error);
    }
}

const createUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/users`, userData);
        return response.data;
    } catch (error) {
        console.error("erro ao criar usuario", error);
    }
    console.log("userData:", userData);
}

const deleteAllUsers = async () => {
    try {
        const response = await axios.delete(`${API_URL}/users`);
        return response.data;
    } catch (error) {
        console.error("erro ao deletar usuarios", error);
    }
}

export default {fetchUsers, createUser, deleteAllUsers};