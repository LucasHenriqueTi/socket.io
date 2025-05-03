import api from './api';
import Cookie from 'js-cookie';

// busca as notificações do usuário
const getNotifications = async (userId) => {
    const response = await api.get(`/notifications/user/${userId}`, {
        headers: {
              'Authorization': `Bearer ${Cookie.get('token')}`
            }
    });
    console.log('getNotifications', response.data);
    return response.data;
};

// marca uma notificação como lida
const markAsRead = async (notificationId) => {
    await api.patch(`/notifications/${notificationId}/read`);
    console.log('markAsRead', notificationId);
};


export { getNotifications, markAsRead };