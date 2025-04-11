import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userData.token);
    setUser(userData);
  
  };
  
  

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
      user: user?.user,
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