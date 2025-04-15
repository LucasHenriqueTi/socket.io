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
    if (user?.id) {
      fetchSharedForms(user.id);
    }
  }, [user, fetchSharedForms]);

  // Busca usuários apenas se não houver
  useEffect(() => {
    if (users.length === 0) {
      fetchUsers();
    }
  }, [fetchUsers, users.length]);

  // Busca formulários apenas se não houver
  useEffect(() => {
    if (forms.length === 0) {
      fetchForms();
    }
  }, [fetchForms, forms.length]);

  // Configura recebimento de notificação via socket
  useEffect(() => {
    if (!socket) return;

    const handleFormShared = (data) => {
      console.log('Notificação recebida:', data);
      setNotification({
        message: data.message || 'Novo formulário compartilhado!',
        severity: 'info',
      });
      fetchSharedForms(user.id); // Atualiza lista
    };

    socket.on('form-shared', handleFormShared);

    return () => {
      socket.off('form-shared', handleFormShared);
    };
  }, [socket, user, fetchSharedForms]);

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
