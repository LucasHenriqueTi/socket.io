import { useState } from 'react';
import { Container } from '@mui/material';
import UserForm from '../components/UserForm';
import UserList from '../components/UserList';
import FormForm from '../components/FormForm';
import FormList from '../components/FormList'
import ShareForm from '../components/ShareForm';
import SharedFormsList from '../components/SharedFormsList';  

const UsersPage = () => {
  const [refresh, setRefresh] = useState(false);

  return (
    <Container maxWidth="md">
      <UserForm onUserCreated={() => setRefresh(!refresh)} />
      <UserList />
      <FormForm />
      <FormList />
      <ShareForm />
      <SharedFormsList />
    </Container>
  );
}

export default UsersPage;