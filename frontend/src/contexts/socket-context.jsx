import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

    // Nova configuração otimizada
    const newSocket = io(socketUrl, {
      path: '/socket.io',
      withCredentials: true,
      autoConnect: false,
      // Configurações críticas:
      reconnection: false, // Desative temporariamente para debug
      transports: ['websocket'], // Force apenas WebSocket inicialmente
      upgrade: false,
      forceNew: true,
      // Configurações de query para evitar cache
      query: {
        _t: Date.now(),
        EIO: 4 // Force Engine.IO v4
      },
      // Configurações de timeout
      pingTimeout: 60000,
      pingInterval: 25000
    });

    // Debug avançado
    const debugEvents = (event, ...args) => {
      if (!['ping', 'pong'].includes(event)) {
        console.log(`Socket ${event}`, args);
      }
    };

    newSocket.onAny(debugEvents);
    newSocket.onAnyOutgoing(debugEvents);

    // Event listeners atualizados
    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Conectado com sucesso!', {
        id: newSocket.id,
        nsp: newSocket.nsp,
        transport: newSocket.io.engine?.transport?.name
      });
    });

    newSocket.on('disconnect', (reason) => {
      setIsConnected(false);
      console.log('Desconectado. Razão:', reason);
    });

    newSocket.on('connect_error', (err) => {
      console.error('Erro de conexão detalhado:', {
        message: err.message,
        type: err.type,
        description: err.description,
        context: err.context
      });
      
      // Tentativa de reconexão manual após 2s
      setTimeout(() => {
        console.log('Tentando reconectar...');
        newSocket.connect();
      }, 2000);
    });

    setSocket(newSocket);

    return () => {
      newSocket.offAny(debugEvents);
      newSocket.offAnyOutgoing(debugEvents);
      newSocket.disconnect();
    };
  }, []);

  const registerUser = (userId) => {
    if (socket && userId && !isConnected) {
      socket.auth = { userId };
      
      // Adiciona listeners temporários
      const onRegistered = (response) => {
        console.log('Usuário registrado:', response);
        socket.off('register-error', onError);
      };
      
      const onError = (error) => {
        console.error('Erro no registro:', error);
        socket.off('user-registered', onRegistered);
      };
      
      socket.once('user-registered', onRegistered);
      socket.once('register-error', onError);
      
      socket.connect();
      socket.emit('register-user', userId);
    }
  };

  const addNotification = (notification) => {
    setNotifications((prev) => [...prev, notification]);
  };

  return (
    <SocketContext.Provider 
      value={{ 
        socket, 
        registerUser, 
        notifications, 
        addNotification,
        isConnected
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export default SocketProvider;