// src/contexts/socket-context.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

    const newSocket = io(socketUrl, {
      withCredentials: true,
      autoConnect: false
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const registerUser = (userId) => {
    if (socket && userId) {
      socket.auth = { userId };
      socket.connect();
      socket.emit('register-user', userId);
    }
  };

  
  const addNotification = (notification) => {
    setNotifications((prev) => [...prev, notification]);
  };

  return (
    <SocketContext.Provider value={{ socket, registerUser, notifications, addNotification }}>
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
