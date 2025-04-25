import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSocket } from './socket-context';
import Cookies from 'js-cookie';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { socket, isConnected, connectSocket, disconnectSocket } = useSocket();

  // função para verificar se o usuário está autenticado
  const login = useCallback((userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    Cookies.set('token', userData.token);
    setUser(userData);
    
    // Configurar autenticação do socket
    if (socket) {
      console.log('[Auth] Configurando autenticação do socket');
      socket.auth = (cb) => cb({ userId: userData.id });
      if (!socket.connected) {
        socket.connect();
      }
    }
  }, [socket]);

  // função para fazer logout do usuário
  const logout = useCallback(() => {
    disconnectSocket();
    localStorage.removeItem('user');
    Cookies.remove('token');
    setUser(null);
  }, [disconnectSocket]);

  // função para verificar se o usuário está autenticado e reconectar o socket em caso de reconexão
  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const token = Cookies.get('token');

      if (storedUser && token) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        if (socket) {
          console.log('[Auth] Inicializando conexão do socket');
          socket.auth = (cb) => cb({ userId: parsedUser.id });
          if (!socket.connected) {
            socket.connect();
          }
        }
      }
      setLoading(false);
    };
  
    initializeAuth();
  }, [socket]); 

  return (
    <AuthContext.Provider
      value={{
        user,
        token: user?.token,
        login,
        logout,
        loading,
        isAuthenticated: !!user,
        socketConnected: isConnected
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export { AuthProvider };