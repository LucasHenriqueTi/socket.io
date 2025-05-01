import { Server } from 'socket.io';
import { shareFormWithUser } from '../repositories/shared-form-repository.js';
import { createNotification, getPedingNotifications, markNotificationAsDelivered } from '../repositories/notification-repository.js';

const configureSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true
        },
        connectionStateRecovery: {
            maxDisconnectionDuration: 120000
        }
    });

    io.use(async (socket, next) => {
        try {
            const userId = parseInt(socket.handshake.auth.userId, 10);
            if (!userId) {
                return next(new Error('Não autenticado'));
            }

            const sockets = await io.in(`user_${userId}`).fetchSockets();
            sockets.forEach(s => {
                if (s.id !== socket.id) {
                    s.disconnect();
                }
            });

            socket.userId = userId;
            next();
        } catch (error) {
            next(error);
        }
    });

    io.on('connection', async (socket) => {
        socket.join(`user_${socket.userId}`);
        
        // Envia notificações pendentes
        try {
            const pendingNotifications = await getPedingNotifications(socket.userId);
            
            for (const notification of pendingNotifications) {
                socket.emit('form-shared', {
                    id: notification.id,
                    senderId: notification.senderId,
                    senderName: notification.sender.name,
                    formId: notification.formId,
                    formName: notification.form.name,
                    message: notification.message,
                    timestamp: notification.createdAt.toISOString()
                });

                await markNotificationAsDelivered(notification.id);
            }
        } catch (error) {
            console.error('Erro ao enviar notificações pendentes:', error);
        }

        socket.on('share-form', async ({ formId, recipientId }, callback) => {
            try {
                // Compartilha o formulário
                const sharedForm = await shareFormWithUser(formId, recipientId);
                
                // Cria a notificação
                const notification = await createNotification(
                    socket.userId,
                    recipientId,
                    formId,
                    `Novo formulário "${sharedForm.form.name}" compartilhado com você!`
                );

                // Verifica se o destinatário está online
                const recipientSocket = [...io.sockets.sockets.values()].find(s => s.userId === recipientId);
                
                if (recipientSocket) {
                    io.to(`user_${recipientId}`).emit('form-shared', {
                        id: notification.id,
                        senderId: notification.senderId,
                        senderName: notification.sender.name,
                        formId: notification.formId,
                        formName: notification.form.name,
                        message: notification.message,
                        timestamp: notification.createdAt.toISOString()
                    });
                    await markNotificationAsDelivered(notification.id);
                }

                ({ success: true, message: 'Formulário compartilhado com sucesso' });
            } catch (error) {
                ({ success: false, message: error.message });
            }
        });

        socket.on('disconnect', () => {
            console.log(`Usuário ${socket.userId} desconectado`);
        });
    });

    return io;
};

export default configureSocket;