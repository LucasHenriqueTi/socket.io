import { useState } from 'react';
import { TextField, Button, Box, Typography, MenuItem } from '@mui/material';
import { useFormContext } from '../contexts/form-context';
import { useUserContext } from '../contexts/user-context';

// cria um formulário
// o formulário tem um nome e um id de usuário criador
const FormForm = () => {
  const { addForm, loading } = useFormContext();
  const { users } = useUserContext([]);
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addForm({ name, userId: (userId) });
      setName('');
      setUserId('');
      console.log('formulário criado')
    } catch (error) {
      console.log('erro ao criar o formulário', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>Criar Formulário</Typography>

      <TextField
        label="Nome do Formulário"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        fullWidth
        margin="normal"
      />

      <TextField
        select
        label="Usuário Responsável"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        required
        fullWidth
        margin="normal"
      >
        {users.map((user, index) => (
          <MenuItem key={index} value={user.id}>
            {user.name} (ID: {user.id})
          </MenuItem>
        ))}
      </TextField>

      <Button
        type="submit"
        variant="contained"
        color="primary"
      >
        Criar Formulário
      </Button>
    </Box>
  );
}

export default FormForm;