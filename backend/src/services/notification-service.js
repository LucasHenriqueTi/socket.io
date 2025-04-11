class NotificationService {
  constructor(io) {
      this.io = io;
      this.userConnections = new Map();
  }

  registerUser(userId, socketId) {
      this.userConnections.set(userId, socketId);
  }

  unregisterUser(userId) {
      this.userConnections.delete(userId);
  }

  async notifyFormShared({ recipientId, formId, senderId }) {
      const recipientSocketId = this.userConnections.get(recipientId);
      
      if (recipientSocketId) {
          this.io.to(recipientSocketId).emit('form-shared', {
              formId,
              senderId,
              message: 'Você recebeu um novo formulário!',
              timestamp: new Date()
          });
      }
      
      // Implementação futura para persistência
      // await this.saveNotification(recipientId, { formId, senderId });
  }

  async saveNotification(userId, notification) {
      // Implementar persistência no banco de dados
  }
}

export default NotificationService;