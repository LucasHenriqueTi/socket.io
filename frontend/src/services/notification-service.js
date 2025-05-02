import api from './api';

// busca as notificações do usuário
const getNotifications = async () => {
    const response = await api.get('/notifications');
    console.log('getNotifications', response.data);
    return response.data;
};

const markAsRead = async (notificationId) => {
    await api.patch(`/notifications/${notificationId}/read`);
    console.log('markAsRead', notificationId);
};