import { registerForm, getForm, getAllFroms } from '../services/form-service.js';

// criar um formulário
const createForm = async (req, res) => {
    const { name, userId } = req.body;
  
    if (!name || !userId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Nome e ID do usuário são obrigatórios' 
      });
    }
  
    try {
      const form = await registerForm(name, Number(userId));
      res.status(201).json({ 
        success: true, 
        form 
      });
    } catch (error) {
      console.error('Erro detalhado:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
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