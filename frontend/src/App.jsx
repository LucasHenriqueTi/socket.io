import { useState, useEffect, useRef } from 'react';
import { toPng } from 'html-to-image';
import './App.css';
import Crud from './services/Crud';
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Grid,
} from '@mui/material';

// Componente para gerar a thumbnail
const UserThumbnail = ({ user }) => {
  console.log('UserThumbnail props:', user); // Verifique se as props estão corretas
  return (
    <Box
      sx={{
        padding: 2,
        backgroundColor: '#f0f0f0',
        borderRadius: 2,
        textAlign: 'center',
        border: '1px solid #ccc',
      }}
    >
      <Typography variant="h6">{user.name}</Typography>
      <Typography variant="body2">Idade: {user.age}</Typography>
      <Typography variant="body2">ID: {user.id}</Typography>
    </Box>
  );
};

function App() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [users, setUsers] = useState([]);
  const thumbnailRef = useRef(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await Crud.fetchUsers();
      setUsers(response); // Supondo que a resposta seja um array de usuários
    } catch (error) {
      console.error('Erro ao buscar usuários', error);
    }
  };

  const generateThumbnail = async (user) => {
    if (thumbnailRef.current) {
      try {
        // Força o navegador a renderizar o conteúdo antes de capturar
        await new Promise((resolve) => setTimeout(resolve, 100));

        const dataUrl = await toPng(thumbnailRef.current, {
          quality: 1, // Qualidade máxima
          pixelRatio: 2, // Melhora a resolução da imagem
        });

        console.log('Thumbnail gerada:', dataUrl); // Verifique se a URL está correta
        return dataUrl;
      } catch (error) {
        console.error('Erro ao gerar thumbnail:', error);
        return null;
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newUser = { name, age };

    try {
      // Gera a thumbnail para o novo usuário
      const thumbnail = await generateThumbnail(newUser);

      // Adiciona a thumbnail ao novo usuário
      const userWithThumbnail = { ...newUser, thumbnail, id: Date.now() }; // Usando timestamp como ID temporário

      // Envia o usuário para o backend
      const response = await Crud.createUser(userWithThumbnail);
      console.log('response:', response);

      // Atualiza a lista de usuários
      setUsers((prevUsers) => [...prevUsers, userWithThumbnail]);

      // Limpa os campos do formulário
      setName('');
      setAge('');
    } catch (error) {
      console.error('erro ao cadastrar usuario', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await Crud.deleteAllUsers();
      console.log('response:', response);
      fetchUsers(); // Atualiza a lista de usuários
    } catch (error) {
      console.error('erro ao deletar usuario', error);
    }
  };

  return (
    <Container>
      <Box sx={{ marginTop: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          CRUD
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Nome"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            label="Idade"
            variant="outlined"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Criar Usuário
          </Button>
        </Box>

        <Button
          onClick={() => handleDelete(null)} // Deletar todos os usuários
          variant="contained"
          color="error"
          sx={{ marginTop: 2 }}
        >
          Deletar Todos
        </Button>

        <Box sx={{ marginTop: 4 }}>
          <Typography variant="h5" gutterBottom>
            Usuários Cadastrados
          </Typography>
          <Grid container spacing={3}>
            {users.map((user) => (
              <Grid item key={user.id} xs={12} sm={6} md={4} lg={2}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={user.thumbnail || 'https://via.placeholder.com/150'} // Fallback para uma imagem padrão
                    alt={user.name}
                  />
                  <CardContent>
                    <Typography variant="h6">{user.name}</Typography>
                    <Typography variant="body2">Idade: {user.age}</Typography>
                    <Typography variant="body2">ID: {user.id}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDelete(user.id)} // Deletar usuário específico
                    >
                      Deletar
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* Elemento oculto para gerar a thumbnail */}
      <Box
        ref={thumbnailRef}
        sx={{
          position: 'fixed', // Usa fixed para garantir que o elemento seja renderizado
          top: 0,
          left: 0,
          width: '300px', // Define um tamanho fixo para o elemento
          visibility: 'hidden', // Oculta o elemento sem afetar a renderização
        }}
      >
        <UserThumbnail user={{ name, age, id: 'temp' }}/> {/* Thumbnail temporária */}
      </Box>
    </Container>
  );
}

export default App;