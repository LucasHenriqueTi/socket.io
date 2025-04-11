import { shareForm } from '../../services/shared-form-service.js';

const userConnections = new Map();

const configureSharedFormHandlers = (io, socket) => {

    // Registrar usuário
    socket.on('register-user', (userId) => {  // Padronizado o nome do evento
        userConnections.set(userId, socket.id);
        console.log(`Usuário ${userId} registrado com socket ${socket.id}`);
    });

    // Notificar compartilhamento
    socket.on('share-form', async ({ formId, recipientId, senderId }) => {
        try {
            const sharedForm = await shareForm(formId, senderId, recipientId);
            
            const recipientSocketId = userConnections.get(recipientId);
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('form-shared', {
                    formId,
                    senderId,
                    message: 'Você recebeu um novo formulário!'
                });
            }
        } catch (error) {
            socket.emit('share-error', error.message);
        }
    });

    // Limpeza ao desconectar
    socket.on('disconnect', () => {
        for (let [userId, socketId] of userConnections.entries()) {
            if (socketId === socket.id) {
                userConnections.delete(userId);
                console.log(`Usuário ${userId} desconectado`);
                break;
            }
        }
    });
};

export default configureSharedFormHandlers;