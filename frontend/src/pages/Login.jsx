import { useState } from 'react';
import { TextField, Button, Box, Alert } from '@mui/material';
import { useAuth } from '../contexts/auth-context';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const Login = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();


const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post('http://localhost:3001/api/login', { name: username});

    const { user, token } = response.data;

    login({ ...user, token }); // agora tem token de verdade

    navigate('/');
  } catch (error) {
    setError(error.response?.data?.message || 'Erro ao fazer login');
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