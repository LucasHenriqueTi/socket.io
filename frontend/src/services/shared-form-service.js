import api from './api';

// Função para compartilhar um formulário com outro usuário
const shareForm = ({formId, userId}) => {
  return api.post('/share', { formId, userId}, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
};

// Função para obter os formulários compartilhados com o usuário
const getSharedForms = (userId) => {
  return api.get(`/shared-forms/${userId}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
};

export { shareForm, getSharedForms };