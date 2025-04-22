import api from './api';
import Cookie from 'js-cookie';


// Função para compartilhar um formulário com outro usuário
const shareForm = ({formId, userId}) => {
  return api.post('/share', { formId, userId}, {
    headers: {
      'Authorization': `Bearer ${Cookie.get('token')}`
    }
  });
};

// Função para obter os formulários compartilhados com o usuário
const getSharedForms = (userId) => {
  return api.get(`/shared-forms/${userId}`, {
    headers: {
      'Authorization': `Bearer ${Cookie.get('token')}`
    }
  });
};

export { shareForm, getSharedForms };