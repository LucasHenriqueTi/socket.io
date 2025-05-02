import {
    createNotification,
    getPedingNotifications,
    getUserNotifications,
    markNotificationAsDelivered,
    markNotificationAsRead,
    deleteNotificationById
} from '../repositories/notification-repository.js';

// serviço para criar uma notificação
const createNewNotification = async (senderId, recipientId, formId, message) => {
    return await createNotification(senderId, recipientId, formId, message);
};

// serviço para buscar noficações pendentes 
const getPedingUserNotifications = async (recipientId) => {
    return await getPedingNotifications(recipientId);
};

// serviço para buscar todas as notificações de um usuário
const getAllUserNotifications = async (userId) => {
    return await getUserNotifications(userId);
};

// serviço para marcar uma notificação como entregue
const deliverNotification = async (notificationId) => {
    return await markNotificationAsDelivered(notificationId);
};

// serviço para marcar uma notificação como lida
const readNotification = async (notificationId) => {
    return await markNotificationAsRead(notificationId);
};

// serviço para deletar uma notificação
const deleteNotification = async (notificationId) => {
    return await deleteNotificationById(notificationId);
};

export {
    createNewNotification,
    getPedingUserNotifications,
    getAllUserNotifications,
    deliverNotification,
    readNotification,
    deleteNotification
};

