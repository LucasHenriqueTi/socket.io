import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSocket } from './socket-context';
import Cookies from 'js-cookie';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { socket, isConnected, connectSocket, disconnectSocket } = useSocket();

  const setupSocketAuth = useCallback((userId) => {
    if (socket) {
      console.log('[Auth] Configurando autenticação do socket para usuário:', userId);
      socket.auth = { userId };
      
      // Remove listeners anteriores para evitar duplicação
      socket.off('connect');
      socket.off('disconnect');
      
      socket.on('connect', () => {
        console.log('[Auth] Socket autenticado com userId:', userId);
      });
      
      socket.on('disconnect', () => {
        console.log('[Auth] Socket desconectado');
      });
      
      if (!socket.connected) {
        connectSocket();
      }
    }
  }, [socket, connectSocket]);

  const login = useCallback((userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    Cookies.set('token', userData.token);
    setUser(userData);
    setupSocketAuth(userData.id);
  }, [setupSocketAuth]);

  const logout = useCallback(() => {
    disconnectSocket();
    localStorage.removeItem('user');
    Cookies.remove('token');
    setUser(null);
  }, [disconnectSocket]);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const token = Cookies.get('token');

      if (storedUser && token) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setupSocketAuth(parsedUser.id);
      }
      setLoading(false);
    };
  
    initializeAuth();
  }, [setupSocketAuth]); 

  return (
    <AuthContext.Provider
      value={{
        user,
        token: user?.token,
        login,
        logout,
        loading,
        isAuthenticated: !!user,
        socket,
        socketConnected: isConnected
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export  default AuthProvider;