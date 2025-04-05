import { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { deleteAllUsers} from "../services/user-service";
import { useUserContext } from "../contexts/user-contex";

const UserForm = ({onUserCreated}) => {
    const {addUser} = useUserContext();
    const [name, setName] = useState('');

    const handleSubmit = async (e) =>{
        e.preventDefault();
        try {
            await addUser(name);
            console.log('usuário criado', name)
            setName('');
            onUserCreated();
        }catch (error) {
            console.log('erro ao criar usuario', error);
        }
    };

    const handleDeleteAll = async() => {
      try {
        await deleteAllUsers();
        console.log('usuários Deletados')
      }catch (error) {
        console.log('erro ao deletar usuários', error);
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
        <Button variant="contained" onClick={handleDeleteAll}>
          Deletar Usuários
        </Button>
      </Box>
    )
}

export default UserForm;