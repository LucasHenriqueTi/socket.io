import { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import createUser from "../services/user-service";

const UserForm = ({onUserCreated}) => {
    const [name, setName] = useState('');

    const handleSubmit = async (e) =>{
        e.preventDefault();
        try {
            await createUser({name});
            setName('');
            onUserCreated();
        }catch (error) {
            console.log('erro ao criar usuario', error);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>Cadastrar Usuário</Typography>
        <TextField
          label="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Cadastrar
        </Button>
      </Box>
    )
}

export default UserForm;