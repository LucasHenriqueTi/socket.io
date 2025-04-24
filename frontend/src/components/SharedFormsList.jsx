import { useEffect, useState } from 'react';
import { useSocket } from '../contexts/socket-context';
import { useSharedFormContext } from '../contexts/share-context';
import { useAuth } from '../contexts/auth-context';
import { useFormContext } from '../contexts/form-context';
import { useUserContext } from '../contexts/user-context';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  AlertTitle
} from '@mui/material';

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const SharedFormsList = () => {
  const { socket } = useSocket();
  const { user } = useAuth();
  const { sharedForms, fetchSharedForms, loading, error } = useSharedFormContext();
  const { users, fetchUsers } = useUserContext();
  const { forms, fetchForms } = useFormContext();
  const [notification, setNotification] = useState(null);

  // Busca os formulários compartilhados do usuário logado
  useEffect(() => {
    if (!user?.id) return;
  
    // Variável para controle de montagem
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        await fetchSharedForms(user.id);
        
        // Verifica se o componente ainda está montado
        if (isMounted) {
          if (users.length === 0) await fetchUsers();
          if (forms.length === 0) await fetchForms();
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    // Adiciona um pequeno delay para evitar múltiplas chamadas rápidas
    const timer = setTimeout(fetchData, 100);
    
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
    // Remova forms e users das dependências
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, fetchSharedForms]);
  
  // Listener de notificações - mantenha separado
  useEffect(() => {
    if (!socket || !user?.id) return;
  
    const handleFormShared = (data) => {
      setNotification({
        message: data.message,
        severity: 'info',
      });
      // Adiciona delay para evitar concorrência
      setTimeout(() => fetchSharedForms(user.id), 300);
    };
  
    socket.on('form-shared', handleFormShared);
  
    return () => {
      socket.off('form-shared', handleFormShared);
    };
  }, [socket, user?.id, fetchSharedForms]);

  const handleClose = () => {
    setNotification(null);
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Usuário logado: {user?.name || 'Desconhecido'}
      </Typography>

      <Typography variant="h5" gutterBottom>
        Formulários Compartilhados
      </Typography>

      {loading || forms.length === 0 || users.length === 0 ? (
        <CircularProgress />
      ) : error ? (
        <MuiAlert severity="error">
          <AlertTitle>Erro</AlertTitle>
          {error}
        </MuiAlert>
      ) : sharedForms.length === 0 ? (
        <Typography variant="body1">Nenhum formulário compartilhado encontrado.</Typography>
      ) : (
        <Grid container spacing={2}>
          {sharedForms.map((item, index) => {
            const form = item.form;
            const sender = form?.user;

            return (
              <Grid item xs={12} sm={6} md={4} key={`${form?.id}-${index}`}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6">
                      {form?.name || `Formulário ID: ${form?.id}`}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      ID do Formulário: {form?.id}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Compartilhado por: {sender?.name || 'Desconhecido'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}

        </Grid>
      )}

      <Snackbar
        open={!!notification}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        {notification && (
          <Alert onClose={handleClose} severity={notification.severity}>
            {notification.message}
          </Alert>
        )}
      </Snackbar>
    </>
  );
};

export default SharedFormsList;
