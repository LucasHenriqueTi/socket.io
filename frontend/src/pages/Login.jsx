import { useState } from 'react';
import { TextField, Button, Box, Alert } from '@mui/material';
import { useAuth } from '../contexts/auth-context';
import { useNavigate } from 'react-router-dom';
import { getUsers } from '../services/user-service';


const Login = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await getUsers();
      
      const user = response.data.users.find(u => u.name === username);
      
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      login({
        name: user.name,
        userId: user.id
      });
      
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8, p: 3 }}>
      <h2>Login</h2>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Nome de usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" fullWidth>
          Entrar
        </Button>
      </Box>
    </Box>
  );
};

export default Login;