import axios from 'axios';

API_URL = process.env.VITE_API_URL

const api = axios.create({
    baseURL: API_URL
})

export default api;