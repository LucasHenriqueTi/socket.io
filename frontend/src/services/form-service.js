import api from './api';

// criar formulário 
const createForm = (formData) => 
    api.post('/forms', formData);

// chama os formulários
const getForms = () => 
    api.get('/forms');

// chama um formulário pelo id
const getFormById = (id) => 
    api.get(`/forms/${id}`);

export default { createForm, getForms, getFormById };