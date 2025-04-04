import { shareForm, getSharedForms } from '../services/shared-form-service.js';

// compartilhar um formulário com um usuário
const shareFormWithUser = async (req, res) => {
    const { formId, userId } = req.body;

    try {
        const sharedForm = await shareForm(formId, userId);
        res.status(201).json({ success: true, sharedForm });
    } catch (error) {
        console.error('Erro ao compartilhar formulário:', error);
        res.status(500).json({ success: false, error: 'Erro ao compartilhar formulário' });
    }
};

// buscar formulários compartilhados por usuário
const getSharedFormsByUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const sharedForms = await getSharedForms(userId);
        res.status(200).json({ success: true, userId , sharedForms });
    } catch (error) {
        console.error('Erro ao buscar formulários compartilhados:', error);
        res.status(500).json({ success: false, error: 'Erro ao buscar formulários compartilhados' });
    }
};

export { shareFormWithUser, getSharedFormsByUser };