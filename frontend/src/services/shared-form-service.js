import api from './api';


export const shareForm = (shareData) => 
    api.post('/share', shareData);

export const getSharedForms = (userId) => 
    api.get(`/shared-forms/${userId}`);