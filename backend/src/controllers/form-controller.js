import { registerForm, getForm, getAllFroms } from '../services/form-service.js';

// criar um formulário
const createForm = async (req, res) => {
    const { name, number:userId } = req.body;

    try {
        const form = await registerForm(name, userId);
        res.status(201).json({ success: true, form });
    } catch (error) {
        console.error('Erro ao criar formulário:', error);
        res.status(500).json({ success: false, error: 'Erro ao criar formulário' });
    }
};

// obter todos os formulários
const getAllForms = async (req, res) => {
    try {
        const forms = await getAllFroms();
        res.status(200).json({ success: true, forms });
    } catch (error) {
        console.error('Erro ao buscar formulários:', error);
        res.status(500).json({ success: false, error: 'Erro ao buscar formulários' });
    }
}


// obter um formulário
const getFormDetails = async (req, res) => {
    const { formId } = req.params;

    try {
        const form = await getForm(formId);
        res.status(200).json({ success: true, form });
    } catch (error) {
        console.error('Erro ao buscar formulário:', error);
        res.status(500).json({ success: false, error: 'Erro ao buscar formulário' });
    }
};

export { createForm, getFormDetails, getAllForms };