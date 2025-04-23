import { shareForm } from '../../services/shared-form-service.js';

// Mapeamento de usuários para conexões (melhor usar WeakMap se possível)
const userConnections = new Map();

// Tempo de heartbeat para verificar conexões ativas
const HEARTBEAT_INTERVAL = 30000; // 30 segundos

const configureSharedFormHandlers = (io, socket) => {
    // Verificador de conexões ativas
    if (!socket.auth?.userId) {
        socket.disconnect();
        return;
    }
    
    const heartbeatInterval = setInterval(() => {
        if (!socket.connected) {
            clearInterval(heartbeatInterval);
        }
    }, HEARTBEAT_INTERVAL);

    // Registrar usuário
    socket.on('register-user', (userId) => {
        if (!userId) {
            return socket.emit('register-error', 'ID do usuário não fornecido');
        }

        try {
            // Remove registros antigos do mesmo usuário
            for (let [existingUserId, socketId] of userConnections.entries()) {
                if (existingUserId === userId) {
                    userConnections.delete(existingUserId);
                    break;
                }
            }

            userConnections.set(userId, socket.id);
            socket.join(`user_${userId}`); // Entra numa sala específica do usuário
            
            console.log(`Usuário ${userId} registrado com socket ${socket.id}`);
            socket.emit('user-registered', { 
                success: true, 
                userId, 
                socketId: socket.id 
            });
        } catch (error) {
            console.error(`Erro ao registrar usuário ${userId}:`, error);
            socket.emit('register-error', 'Erro interno no servidor');
        }
    });

    // Notificar compartilhamento
    socket.on('share-form', async ({ formId, userId, senderId }) => {
        if (!formId || !userId || !senderId) {
            return socket.emit('share-error', 'Dados incompletos para compartilhamento');
        }

        try {
            console.log(`Tentando compartilhar formulário ${formId} com usuário ${userId}`);
            
            const sharedForm = await shareForm(formId, senderId, userId);
            
            // Notifica via sala do usuário (mais confiável que socketId direto)
            io.to(`user_${userId}`).emit('form-shared', {
                formId,
                senderId,
                sharedAt: new Date().toISOString(),
                message: 'Você recebeu um novo formulário!',
                formData: sharedForm // Adicione dados relevantes do formulário
            });

            console.log(`Formulário ${formId} compartilhado com sucesso para ${userId}`);
        } catch (error) {
            console.error(`Erro ao compartilhar formulário ${formId}:`, error);
            
            socket.emit('share-error', {
                message: 'Falha ao compartilhar formulário',
                error: error.message,
                formId,
                userId
            });
        }
    });

    // Limpeza ao desconectar
    const cleanup = () => {
        clearInterval(heartbeatInterval);
        
        for (let [userId, socketId] of userConnections.entries()) {
            if (socketId === socket.id) {
                userConnections.delete(userId);
                console.log(`Usuário ${userId} desconectado (socket ${socket.id})`);
                break;
            }
        }
    };

    socket.on('disconnect', cleanup);
    socket.on('error', (err) => {
        console.error(`Erro no socket ${socket.id}:`, err);
        cleanup();
    });

    // Evento para verificação de conexão
    socket.on('ping', (cb) => {
        if (typeof cb === 'function') {
            cb('pong');
        }
    });
};

export default configureSharedFormHandlers;