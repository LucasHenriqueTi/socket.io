import {
    createNewNotification,
    getAllUserNotifications,
    readNotification,
    deleteNotification
} from '../services/notification-service.js';

// Cria uma notificação 
const createNotification = async (req, res) => {
    const { senderId, recipientId, formId, message } = req.body;

    try {
        const notification = await createNewNotification(senderId, recipientId, formId, message);
        res.status(201).json({sucess: true, notification});
    } catch (error) {
        console.error('Erro ao criar notificação', error);
        res.status(500).json({success: false, message: 'Erro ao criar notificação'});
    }
};

// Obtem todas as notificações do usuário
const getUserNotifications = async (req, res) => {
    const { userId } = req.params;

    try {
        const notifications = await getAllUserNotifications(userId);
        res.status(200).json({success: true, notifications});
    } catch (error) {
        console.error('Erro ao buscar notificações', error);
        res.status(500).json({success: false, message: 'Erro ao buscar notificações'});
    }
};

// Marca uma notificação como lida
const markNotificationAsRead = async (req, res) => {
    const { notificationId } = req.params;

    try {
        const notification = await readNotification(notificationId);
        res.status(200).json({success: true, notification});
    } catch (error) {
        console.error('Erro ao marcar notificação como lida', error);
        res.status(500).json({success: false, message: 'Erro ao marcar notificação como lida'});
    }
};

// Deleta uma notificação
const deleteUserNotification = async (req, res) => {
    const { notificationId } = req.params;

    try {
        const notification = await deleteNotification(notificationId);
        res.status(200).json({success: true, notification});
    } catch (error) {
        console.error('Erro ao deletar notificação', error);
        res.status(500).json({success: false, message: 'Erro ao deletar notificação'});
    }
};

export {
    createNotification,
    getUserNotifications,
    markNotificationAsRead,
    deleteUserNotification
};