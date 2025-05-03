import { useEffect, useState } from 'react';
import { useNotifications } from '../contexts/notification-context';
import { useSharedFormContext } from '../contexts/share-context';
import { useAuth } from '../contexts/auth-context';
import { useFormContext } from '../contexts/form-context';
import { useUserContext } from '../contexts/user-context';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert as MuiAlert,
  AlertTitle,
  Snackbar,
  Box
} from '@mui/material';

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const SharedFormsList = () => {
  const { user } = useAuth();
  const { sharedForms, fetchSharedForms, loading, error } = useSharedFormContext();
  const { users, fetchUsers } = useUserContext();
  const { forms, fetchForms } = useFormContext();
  const { markAsRead } = useNotifications();
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info',
    notificationId: null
  });

  // Busca os formulários compartilhados do usuário logado
  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        await fetchSharedForms(user.id);
        if (users.length === 0) await fetchUsers();
        if (forms.length === 0) await fetchForms();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [user?.id, fetchSharedForms, fetchUsers, fetchForms]);

  // Função para fechar a notificação
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;

    if (notification.notificationId) {
      markAsRead(notification.notificationId);
    }

    setNotification(prev => ({ ...prev, open: false }));
  };

  // Função para gerar chaves únicas seguras
  const getSafeKey = (item) => {
    if (item?.id) return `shared-${item.id}`;
    if (item?.form?.id) return `form-${item.form.id}`;
    return `gen-${Math.random().toString(36).substr(2, 9)}`;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Formulários Compartilhados com {user?.name || 'Você'}
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <MuiAlert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Erro</AlertTitle>
          {error}
        </MuiAlert>
      ) : sharedForms.length === 0 ? (
        <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
          Nenhum formulário foi compartilhado com você ainda.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {sharedForms.map((item) => {
            const form = item?.form || {};
            const sender = form?.user || {};

            return (
              <Grid item xs={12} sm={6} md={4} key={getSafeKey(item)}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {form.name || 'Formulário sem nome'}
                    </Typography>
                    
                    {form.id && (
                      <Typography variant="body2" color="text.secondary" paragraph>
                        ID: {form.id}
                      </Typography>
                    )}

                    {sender.name && (
                      <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                        <Typography variant="body2">
                          <strong>Compartilhado por:</strong> {sender.name}
                        </Typography>
                        {sender.id && (
                          <Typography variant="body2" color="text.secondary">
                            ID do remetente: {sender.id}
                          </Typography>
                        )}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleClose}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SharedFormsList;