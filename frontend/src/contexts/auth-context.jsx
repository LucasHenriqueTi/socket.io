import { createContext, useContext, useState, useEffect } from 'react';
import { useSocket } from './socket-context';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const {socket, registerUser} = useSocket

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userData.token);
    setUser(userData);
  
  };
  
  // inicia a room do usuário autenticado
  useEffect(() => {
    if (user?.id && socket) {
      registerUser(user.id);
    }
  }, [user, socket]);
  

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  // Verifica se já está logado ao carregar
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);
  

  return (
    <AuthContext.Provider value={{
      user: user,
      token: user?.token,
      login,
      logout,
      isAuthenticated: !!user
    }}>
    
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export { AuthProvider };