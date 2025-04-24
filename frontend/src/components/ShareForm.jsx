import { useState, useEffect } from 'react';
import { useSocket } from '../contexts/socket-context';
import { useSharedFormContext } from '../contexts/share-context';
import { useFormContext } from '../contexts/form-context';
import { useUserContext } from '../contexts/user-context';
import { Button, MenuItem, Box, Typography, TextField, CircularProgress, Alert, Snackbar } from '@mui/material';

const ShareForm = () => {
  const [formId, setFormId] = useState('');
  const [userId, setUserId] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { socket } = useSocket();
  const { shareForm, loading } = useSharedFormContext();
  const { forms, loading: formsLoading } = useFormContext();
  const { users, loading: usersLoading } = useUserContext();

  const handleShare = async () => {
    setError(null);
    setSuccess(null);

    try {
      // 1. Primeiro compartilha no banco de dados
      await shareForm(Number(formId), Number(userId));
      
      // 2. Emite o evento via socket com callback
      if (socket) {
        socket.emit('share-form', 
          { formId: Number(formId), recipientId: Number(userId) },
          (response) => {
            if (response.success) {
              setSuccess(response.message);
            } else {
              setError(response.error);
            }
          }
        );
      } else {
        setSuccess('Formulário compartilhado (usuário offline será notificado quando se conectar)');
      }
      
      setFormId('');
      setUserId('');
    } catch (error) {
      setError(error.message || 'Erro ao compartilhar formulário');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Compartilhar Formulário
      </Typography>

      <TextField
        select
        label="Formulário"
        value={formId}
        onChange={(e) => setFormId(e.target.value)}
        fullWidth
        margin="normal"
        disabled={formsLoading}
      >
        {formsLoading ? (
          <MenuItem disabled>
            <CircularProgress size={24} />
          </MenuItem>
        ) : (
          forms.map((form) => (
            <MenuItem key={form.id} value={form.id}>
              {form.name} (ID: {form.id})
            </MenuItem>
          ))
        )}
      </TextField>

      <TextField
        select
        label="Usuário"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        fullWidth
        margin="normal"
        disabled={usersLoading}
      >
        {usersLoading ? (
          <MenuItem disabled>
            <CircularProgress size={24} />
          </MenuItem>
        ) : (
          users.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {user.name} (ID: {user.id})
            </MenuItem>
          ))
        )}
      </TextField>

      <Button
        variant="contained"
        color="primary"
        onClick={handleShare}
        disabled={!formId || !userId || loading}
        sx={{ mt: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Compartilhar'}
      </Button>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
      >
        <Alert severity="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ShareForm;