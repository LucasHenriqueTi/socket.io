import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Conecta o socket com autenticação
  const connectSocket = (userId) => {
    if (socket && !isConnected) {
      socket.auth = { userId };
      socket.connect();
    }
  };

  // Desconecta o socket
  const disconnectSocket = () => {
    if (socket && isConnected) {
      socket.disconnect();
    }
  };

  useEffect(() => {
    const socketUrl ='http://localhost:3001';
    
    // Cria uma nova instância do socket.io
    const newSocket = io(socketUrl, {
      autoConnect: false,
      withCredentials: true,
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    
    // Event listeners

    // Evento de autenticação
    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Socket conectado! ID:', newSocket.id);
    });

    // Evento de desconexão
    newSocket.on('disconnect', (reason) => {
      setIsConnected(false);
      console.log('Socket desconectado. Razão:', reason);
    });

    // Evento de erro de conexão
    newSocket.on('connect_error', (err) => {
      console.error('Erro de conexão:', err.message);
    });

    setSocket(newSocket);

    // Conecta o socket quando o componente é montado
    return () => {
      newSocket.off('connect');
      newSocket.off('disconnect');
      newSocket.off('connect_error');
      newSocket.disconnect();
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
};

export const useSocket = () => useContext(SocketContext);
export default SocketProvider;