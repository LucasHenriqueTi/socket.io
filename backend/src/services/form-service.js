import {createForm, getFormsById, getAllForms} from '../repositories/form-repository.js';

// criar um formulário
const registerForm = async (name, userId) => {
    return await createForm(name, userId);
};

// obter todos os formulários
const getAllFroms = async () => {
    return await getAllForms();
};

// obter um formulário
const getForm = async (formId) => {
    return await getFormsById(formId);
};

export {registerForm, getForm, getAllFroms};