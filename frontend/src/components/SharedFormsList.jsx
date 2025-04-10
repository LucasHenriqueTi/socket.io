import { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Typography, Chip, Box, CircularProgress, Alert } from '@mui/material';
import { useSharedFormContext } from '../contexts/share-context';
import { useAuth } from '../contexts/auth-context';
import { useUserContext } from '../contexts/user-context';

const SharedFormsList = () => {
  const { 
    sharedForms, 
    loading: sharedFormsLoading, 
    error: sharedFormsError,
    fetchSharedForms 
  } = useSharedFormContext();
  
  const { user } = useAuth();
  const { users, loading: usersLoading, error: usersError, fetchUsers } = useUserContext();
  const [filteredForms, setFilteredForms] = useState([]);

  useEffect(() => {
    if (user?.userId) {
      fetchSharedForms(user.userId);
      fetchUsers();
    }
  }, [user?.userId, fetchSharedForms, fetchUsers]);

  // Filtra os formulários válidos
  useEffect(() => {
    if (sharedForms && Array.isArray(sharedForms)) {
      const validForms = sharedForms.filter(form => 
        form.id && form.formId && form.form?.userId
      );
      setFilteredForms(validForms);
    }
  }, [sharedForms]);

  const getSenderName = (senderId) => {
    try {
      if (!users || !Array.isArray(users)) return `Usuário ${senderId}`;
      
      const sender = users.find(u => String(u.id) === String(senderId));
      return sender?.name || `Usuário ${senderId}`;
    } catch (error) {
      console.error('Erro ao obter nome do remetente:', error);
      return `Usuário ${senderId}`;
    }
  };

  if (sharedFormsLoading || usersLoading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (sharedFormsError || usersError) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {sharedFormsError || usersError || 'Erro ao carregar dados'}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Formulários Compartilhados com Você
      </Typography>
      
      {filteredForms.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          {sharedForms?.length > 0 ? 'Carregando formulários...' : 'Nenhum formulário compartilhado ainda.'}
        </Typography>
      ) : (
        <List>
          {filteredForms.map((shared, index) => (
            <ListItem key={index} divider>
              <ListItemText
                primary={shared.form?.name || 'Formulário sem nome'}
                secondary={
                  <Box component="span" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Typography component="span" variant="body2">
                      Compartilhado por: {getSenderName(shared.form?.userId)}
                    </Typography>
                    <Chip
                      label={`ID Form: ${shared.formId}`}
                      size="small"
                      sx={{ ml: 1 }}
                      color="primary"
                    />
                    <Chip
                      label={`ID Compart.: ${shared.id}`}
                      size="small"
                      sx={{ ml: 1 }}
                      color="secondary"
                    />
                  </Box>
                }
                secondaryTypographyProps={{ component: 'div' }}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default SharedFormsList;