import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './auth-context';
import {getNotifications, markAsRead} from '../services/notification-service';

const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { socket, isAuthenticated } = useAuth();

  const storedUser = localStorage.getItem('user');
  const userId = storedUser ? JSON.parse(storedUser).id : null;

  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    
    try {
      const data = await getNotifications(userId);
      setNotifications(data.notifications);
      updateUnreadCount(data.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const updateUnreadCount = (notifs) => {
    const count = notifs.filter(n => !n.read).length;
    setUnreadCount(count);
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
      setUnreadCount(prev => prev - 1);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    
    fetchNotifications();

    // Configura listener do socket para novas notificações
    if (socket) {
      socket.on('form-shared', (notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      });

      return () => {
        socket.off('form-shared');
      };
    }
  }, [socket, isAuthenticated]);

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount,
      fetchNotifications,
      markNotificationAsRead 
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);

export default NotificationProvider;