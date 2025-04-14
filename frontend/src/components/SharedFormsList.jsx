import { useEffect, useState } from 'react';
import { useSocket } from '../contexts/socket-context';
import { useSharedFormContext } from '../contexts/share-context';
import { useAuth } from '../contexts/auth-context';
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
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    console.log('Usuário logado:', user);
    if (user?.id) {
      fetchSharedForms(user.id);
    }
  }, [user, fetchSharedForms]);

  useEffect(() => {
    if (!socket) return;

    const handleFormShared = (data) => {
      console.log('Notificação recebida:', data);
      setNotification({
        message: data.message || 'Novo formulário compartilhado!',
        severity: 'info',
      });
      // Atualiza a lista de compartilhados após a notificação
      fetchSharedForms(user.id);
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
      <Typography variant="h5" gutterBottom>
        Formulários Compartilhados
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <MuiAlert severity="error">
          <AlertTitle>Erro</AlertTitle>
          {error}
        </MuiAlert>
      ) : (
        <Grid container spacing={2}>
          {sharedForms.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6">
                    {item.form?.title || `Formulário ID: ${item.formId}`}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Compartilhado por: {item.sender?.name || item.senderId}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
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
