import { useState } from 'react';
import { Container } from '@mui/material';
import UserForm from '../components/UserForm';
import UserList from '../components/UserList';

const UsersPage = () => {
  const [refresh, setRefresh] = useState(false);

  return (
    <Container maxWidth="md">
      <UserForm onUserCreated={() => setRefresh(!refresh)} />
      <UserList />
    </Container>
  );
}

export default UsersPage;