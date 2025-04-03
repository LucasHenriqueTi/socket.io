import api from './api';


const shareForm = (shareData) => 
    api.post('/share', shareData);

const getSharedForms = (userId) => 
    api.get(`/shared-forms/${userId}`);

export { shareForm, getSharedForms }