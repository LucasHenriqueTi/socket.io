import prisma from '../config/db.js';

// cria uma nova notificação
const createNotification = async (senderId, recipientId, formId, message) => {
    return await prisma.notification.create({
        data: {
            senderId: perseInt(senderId, 10),
            recipientId: perseInt(recipientId, 10),
            formId: perseInt(formId, 10),
            message
        },
        include: {
            form: true,
            sender: true
        }
    });
};

// Busca notificações pedentes (não entregues)
const getPedingNotifications = async (recipientId) => {
    return await prisma.notification.findMany({
        where: {
            recipientId: parseInt(recipientId, 10),
            delivered: false
        },
        orderBy: {
            createdAt: 'asc'
        },
        include: {
            form: true,
            sender: true
        }
    });
};

// Busca todas as notificações de um usuário
const getUserNotifications = async (userId) => {
    return await prisma.notification.findMany({
        where: {
            recipientId: parseInt(userId, 10)
        },
        ordenBy: {
            createdAt: 'asc'
        },
        include: {
            form: true,
            sender: true
        }
    });
};

// marca uma notificação como entregue
const markNotificationAsDelivered = async (notificationId) => {
    return await prisma.notification.update({
        where: { id: parseInt(notificationId, 10) },
        data: { delivered: true}
    });
};

const markNotificationAsRead = async (notificationId) => {
    return await prisma.notification.update({
        where: { id: parseInt(notificationId, 10)},
        data: { read: true}
    })
}