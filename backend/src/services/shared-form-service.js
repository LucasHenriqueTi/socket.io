import {shareFormWithUser, getSharedFormsByUser} from '../repositories/shared-form-repository.js';

// compartilhar formulário com usuário
const shareForm = async (formId, userId) => {
    return await shareFormWithUser(formId, userId);
};

// buscar formulários compartilhados por usuário
const getSharedForms = async (userId) => {
    return await getSharedFormsByUser(userId);
}

export {shareForm, getSharedForms};