import { createContext, useContext, useState, useEffect } from 'react';
import { useSocket } from './socket-context';
import Cookies from 'js-cookie';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const { socket, registerUser } = useSocket();

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    Cookies.set('token', userData.token);
    setUser(userData);
  };

  useEffect(() => {
    if (user?.id && socket) {
      registerUser(user.id);
    }
  }, [user, socket]);

  const logout = () => {
    localStorage.removeItem('user');
    Cookies.remove('token');
    setUser(null);
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
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: user,
        token: user?.token,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export { AuthProvider };
