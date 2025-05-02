import { Children, createContext, useContext, useEffect, useState } from 'react';
import { useSocket } from './socket-context';
import {getNotifications, markAsRead} from '../services/notification-service';

const NotificationContext = createContext();

const NotificationProvider = ({ children}) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const { socket } = useSocket();

    const userId = localStorage.getItem('userId')

    const fetchNotifications = async () => {
        try {
            const data = await getNotifications(userId);
            setNotifications(data);
            updateUnreadCount(data);
            console.log('notificações recebidas:', data);
        } catch (error) {
            console.error('error ao buscar notificações:', error);
        }
    };

    const updateUnreadCount = (notifs) => {
        const count = notifs.filter(n => !n.read).length;
        setUnreadCount(count);
    }

    const markNotificationAsRead = async (notificationId) => {
        try {
            await markAsRead(notificationId);
            setNotifications(prev => prev.map(n => 
                n.id === notificationId ? { ...n, read: true } : n));
                console.log('notificação marcada como lida:', notificationId);
            setUnreadCount(prev => prev - 1);
        } catch (error) {
            console.error('error ao marcar notificação como lida:', error);
        }
    };

    useEffect(()=> {
        fetchNotifications();

        if (socket) {
            socket.on('form-shared', (notification) => {
                setNotifications(prev => [notification, ...prev]);
                setUnreadCount(prev => prev + 1);
                console.log('notificação recebida:', notification);
            });
        }
        return () => {
            if (socket) {
                socket.off('form-shared');
            }
        };
    },[socket]);


return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount,
      fetchNotifications,
      markNotificationAsRead, 
    }}>
      {children}
    </NotificationContext.Provider>
  );
}
export const useNotifications = () => useContext(NotificationContext);