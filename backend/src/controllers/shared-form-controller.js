import { shareForm, getSharedForms } from '../services/shared-form-service.js';

// O controller não deve criar instância do NotificationService
// O serviço será injetado via construtor ou receberá o io

const shareFormWithUser = async (req, res) => {
    const { formId, userId } = req.body;
    const senderId = req.user.id;

    try {
        const sharedForm = await shareForm(formId, senderId, userId);
        
        // Notificação será tratada pelo handler do socket
        res.status(201).json({ success: true, sharedForm });
    } catch (error) {
        console.error('Erro ao compartilhar formulário:', error);
        res.status(500).json({ success: false, error: 'Erro ao compartilhar formulário' });
    }
};

const getSharedFormsByUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const sharedForms = await getSharedForms(userId);
        res.status(200).json({ success: true, userId, sharedForms });
    } catch (error) {
        console.error('Erro ao buscar formulários compartilhados:', error);
        res.status(500).json({ success: false, error: 'Erro ao buscar formulários compartilhados' });
    }
};

export { shareFormWithUser, getSharedFormsByUser };