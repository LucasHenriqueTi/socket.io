import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/auth-context'
import UsersPage from '../pages/UsersPage'
import Login from '../pages/Login'

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>; // Ou um spinner bonitinho com MUI se quiser
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/users" element={
        <PrivateRoute>
          <UsersPage />
        </PrivateRoute>
      } />
      
      
      
      
      
      <Route path="/" element={<Navigate to="/users" replace />} />
      
      <Route path="*" element={<Navigate to="/users" replace />} />
    </Routes>
  )
}

export default AppRoutes