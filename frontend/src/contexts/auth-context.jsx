import { createContext, useContext, useState, useEffect } from 'react';
import { useSocket } from './socket-context';
import Cookies from 'js-cookie';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { socket, isConnected, connectSocket, disconnectSocket } = useSocket();

  // Efeito principal que gerencia a conexão do socket
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = Cookies.get('token');
    
    // Verifica se o usuário está autenticado
    if (storedUser && token) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      // Reconecta automaticamente se o usuário está autenticado
      if (socket && !isConnected) {
        console.log('Reconectando socket para usuário autenticado...');
        connectSocket(parsedUser.id);
      }
    } else {
      setLoading(false);
    }
  }, [socket, isConnected, connectSocket]);

  // Monitora mudanças na conexão do socket
  useEffect(() => {
    if (socket) {
      const handleConnect = () => {
        console.log('Socket conectado - usuário:', user?.id);
        setLoading(false);
      };

      const handleDisconnect = () => {
        console.log('Socket desconectado');
      };

      socket.on('connect', handleConnect);
      socket.on('disconnect', handleDisconnect);

      return () => {
        socket.off('connect', handleConnect);
        socket.off('disconnect', handleDisconnect);
      };
    }
  }, [socket, user]);

  // Função de login que armazena o usuário no localStorage e define o token no cookie
  const login = async (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    Cookies.set('token', userData.token);
    setUser(userData);
    
    if (socket) {
      connectSocket(userData.id);
    }
  };

  // Função de logout que remove o usuário do localStorage e o token do cookie
  const logout = () => {
    disconnectSocket();
    localStorage.removeItem('user');
    Cookies.remove('token');
    setUser(null);
  };

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