import { createContext, useContext, useState, useEffect } from 'react';
import { useSocket } from './socket-context';
import Cookies from 'js-cookie';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { socket, isConnected } = useSocket();

  const login = async (userData) => {
    try {
      // 1. Armazena os dados do usuário
      localStorage.setItem('user', JSON.stringify(userData));
      Cookies.set('token', userData.token);
      setUser(userData);
      
      // 2. Conecta o socket se ainda não estiver conectado
      if (socket && !isConnected) {
        socket.auth = { userId: userData.id };
        socket.connect();
      }
    } catch (error) {
      console.error('Erro durante o login:', error);
      throw error;
    }
  };

  const logout = () => {
    try {
      // 1. Desconecta o socket antes de limpar os dados
      if (socket) {
        socket.disconnect();
      }
      
      // 2. Limpa os dados de autenticação
      localStorage.removeItem('user');
      Cookies.remove('token');
      setUser(null);
    } catch (error) {
      console.error('Erro durante o logout:', error);
    }
  };

  // Efeito para lidar com a conexão automática quando:
  // - O componente monta
  // - O usuário já está autenticado
  // - O socket fica disponível
  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const token = Cookies.get('token');
    
      if (storedUser && token) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // Conecta o socket se o usuário estiver autenticado
        if (socket && !isConnected) {
          socket.auth = { userId: parsedUser.id };
          socket.connect();
        }
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, [socket, isConnected]);

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