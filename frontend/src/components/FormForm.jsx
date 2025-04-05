import { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { createForm } from '../services/form-service';


// cria um formulário
// o formulário tem um nome e um id de usuário criador
const FormForm = () => {
    const [name, setName] = useState('');
    const [userId, setUserId] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createForm({name, userId: (userId)});
            setName('');
            setUserId('');
            console.log('formulário criado')
        }catch(error){
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
            label="ID do Usuário"
            type="number"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary">
            Criar
          </Button>
        </Box>
      );
}

export default FormForm;