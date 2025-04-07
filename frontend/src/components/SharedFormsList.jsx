import { useEffect } from 'react';
import { List, ListItem, ListItemText, Typography, Chip, Box, CircularProgress, Alert } from '@mui/material';
import { useSharedFormContext } from '../contexts/share-context';


// listar os formulários compartilhados com o usuário
const SharedFormsList = ({ userId }) => {
  const { 
    sharedForms, 
    loading, 
    error,
    fetchSharedForms 
  } = useSharedFormContext();
  
  

  useEffect(() => {
    if (userId) {
      fetchSharedForms(userId);
    }
  }, [userId, fetchSharedForms]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Formulários Compartilhados com Você
      </Typography>
      
      {sharedForms.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Nenhum formulário compartilhado ainda.
        </Typography>
      ) : (
        <List>
          {sharedForms.map((shared, index) => (
            <ListItem key={index} divider>
              <ListItemText
                primary={shared.form?.name || 'Formulário sem nome'}
                secondary={
                  <Box component="span" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Typography component="span" variant="body2">
                      Compartilhado por: {shared.sender?.name || `ID: ${shared.senderId}`}
                    </Typography>
                    <Chip
                      label={`ID: ${shared.formId}`}
                      size="small"
                      sx={{ ml: 1 }}
                      color="primary"
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