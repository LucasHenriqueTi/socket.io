import { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const connectSocket = () => {
    if (socket && !socket.connected) {
      socket.connect();
    }
  };

  const disconnectSocket = () => {
    if (socket && socket.connected) {
      socket.disconnect();
    }
  };

  useEffect(() => {
    const newSocket = io('http://localhost:3001', {
      withCredentials: true,
      autoConnect: false, // Não conecta automaticamente - será controlado pelo AuthContext
    });

    newSocket.on('connect', () => {
      console.log('[Socket] Conectado');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('[Socket] Desconectado');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (err) => {
      console.error('[Socket] Erro de conexão:', err.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      newSocket.off('connect');
      newSocket.off('disconnect');
      newSocket.off('connect_error');
    };
  }, []);

  return (
    <SocketContext.Provider value={{ 
      socket, 
      isConnected,
      connectSocket,
      disconnectSocket
    }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);

export default SocketProvider;