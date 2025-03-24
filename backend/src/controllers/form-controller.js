import { registerForm, getForm, getAllFroms } from '../services/form-service.js';

const createForm = async (req, res) => {
    const { name, userId } = req.body;

    try {
        const form = await registerForm(name, userId);
        res.status(201).json({ success: true, form });
    } catch (error) {
        console.error('Erro ao criar formulário:', error);
        res.status(500).json({ success: false, error: 'Erro ao criar formulário' });
    }
};

const getAllForms = async (req, res) => {
    try {
        const forms = await getAllFroms();
        res.status(200).json({ success: true, forms });
    } catch (error) {
        console.error('Erro ao buscar formulários:', error);
        res.status(500).json({ success: false, error: 'Erro ao buscar formulários' });
    }
}

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