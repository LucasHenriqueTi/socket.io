import api from './api';
import Cookie from 'js-cookie';

// criar formulário 
const createForm = ({name, userId}) =>
    api.post('/forms', { name, userId },
        {
            headers: {
                'Authorization': `Bearer ${Cookie.get('token')}`
            }
        });

// chama os formulários
const getForms = () =>
    api.get('/forms',
        {
            headers: {
                'Authorization': `Bearer ${Cookie.get('token')}`
            }
        });

// chama um formulário pelo id
const getFormById = (id) =>
    api.get(`/forms/${id}`,
        {
            headers: {
                'Authorization': `Bearer ${Cookie.get('token')}`
            }
        });

export { createForm, getForms, getFormById };