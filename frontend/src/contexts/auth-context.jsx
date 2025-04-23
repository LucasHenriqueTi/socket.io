import { createContext, useContext, useState, useEffect } from 'react';
import { useSocket } from './socket-context';
import Cookies from 'js-cookie';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { socket, registerUser, isConnected } = useSocket();

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    Cookies.set('token', userData.token);
    setUser(userData);
    
    // Força o registro imediato após login
    if (socket) {
      registerUser(userData.id);
    }
  };

  // Efeito para registrar usuário quando socket estiver pronto
  useEffect(() => {
    if (user?.id && socket && !isConnected) {
      registerUser(user.id);
    }
  }, [user, socket, isConnected]);

  const logout = () => {
    localStorage.removeItem('user');
    Cookies.remove('token');
    setUser(null);
    if (socket) {
      socket.disconnect();
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem('user');
    const token = Cookies.get('token');
  
    if (stored && token) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
    } else {
      setUser(null);
    }
  
    setLoading(false); 
  }, []);

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