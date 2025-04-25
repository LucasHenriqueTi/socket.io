import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const connectionRef = useRef(false);

  // Função para redefinir a autenticação do socket
  const resetSocketAuth = useCallback(() => {
    if (socket) {
      socket.auth = (cb) => cb({ token: null });
    }
  }, [socket]);
  console.log('[SocketContext] Estado atual:', { isConnected, notifications: notifications.length });

  // função para conectar o socket
  const connectSocket = useCallback((userId) => {
    console.log('[SocketContext] connectSocket chamado para userId:', userId);

    if (socket && !isConnected) {
      console.log('[SocketContext] Conectando socket...');
      socket.auth = { userId };
      socket.connect();
    } else {
      console.warn('[SocketContext] Socket não disponível ou já conectado');
    }
  }, [socket, isConnected]);

  // função para desconectar o socket
  const disconnectSocket = useCallback(() => {
    console.log('[SocketContext] disconnectSocket chamado');
    if (socket) {
      console.log('[SocketContext] Desconectando socket...');
      resetSocketAuth();
      socket.disconnect();
    }
  }, [socket, resetSocketAuth]);

  // função para marcar notificação como lida
  const markNotificationAsRead = useCallback((notificationId) => {
    console.log('[SocketContext] Marcando notificação como lida:', notificationId);
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  }, []);

  // função para limpar todas as notificações
  const clearNotifications = useCallback(() => {
    console.log('[SocketContext] Limpando todas as notificações');
    setNotifications([]);
  }, []);

  // Efeito para configurar o socket
  useEffect(() => {
    console.log('[SocketContext] Iniciando configuração do socket...');

    const socketUrl = 'http://localhost:3001';
    console.log('[SocketContext] Conectando a:', socketUrl);

    const newSocket = io(socketUrl, {
      autoConnect: false, // Importante manter como false
      withCredentials: true,
      transports: ['websocket'],
      reconnection: false,
      auth: (cb) => cb({token: null})
      });
    
      // Controle de conexão
    const onConnect = () => {
      if (!connectionRef.current) {
        console.log('[SocketContext] Conexão estabelecida');
        connectionRef.current = true;
        setIsConnected(true);
      }
    };

    const onDisconnect = (reason) => {
      if (connectionRef.current) {
        console.log('[SocketContext] Desconexão:', reason);
        connectionRef.current = false;
        setIsConnected(false);
      }
    };

    // estabelece a conexão com o socket
    newSocket.on('connect', onConnect, () => {
      console.log('[SocketContext] Socket conectado com sucesso. ID:', newSocket.id);
      setIsConnected(true);
    });

    // escuta o evento de desconexão
    newSocket.on('disconnect', onDisconnect, (reason) => {
      console.log('[SocketContext] Socket desconectado. Razão:', reason);
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('[SocketContext] Erro de conexão:', error.message);
    });

    // escuta o evento de compartilhamento de formulário
    newSocket.on('form-shared', (notification) => {
      console.log('[SocketContext] Nova notificação recebida:', notification);
      setNotifications(prev => [{
        ...notification,
        read: false,
        type: 'form-shared'
      }, ...prev]);
    });

    // DEBUG: Monitora todas as mensagens recebidas (apenas para desenvolvimento)
    if (process.env.NODE_ENV === 'development') {
      newSocket.onAny((event, ...args) => {
        if (!['pong'].includes(event)) { // Filtra eventos de ping/pong
          console.debug('[SocketContext] Evento recebido:', event, args);
        }
      });
    }

    setSocket(newSocket);
    console.log('[SocketContext] Socket configurado com sucesso');

    // Limpeza do socket ao desmontar o componente
    return () => {
      console.log('[SocketContext] Limpando socket...');
      newSocket.off('connect', onConnect);
      newSocket.off('disconnect', onDisconnect);
      connectionRef.current = false;
      newSocket.off('connect_error');
      newSocket.off('form-shared');
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{
      socket,
      isConnected,
      notifications,
      connectSocket,
      disconnectSocket,
      markNotificationAsRead,
      clearNotifications,
      resetSocketAuth
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
export default SocketProvider;