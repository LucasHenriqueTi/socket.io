import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Conexão básica - ajuste a URL conforme necessário
    const socketUrl = 'http://localhost:3001';
    const newSocket = io(socketUrl);

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Conectado ao servidor Socket.IO');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Desconectado do servidor Socket.IO');
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
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