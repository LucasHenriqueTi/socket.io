import { useState } from 'react';
import { Button, MenuItem, Box, Typography, TextField, CircularProgress, Alert } from '@mui/material';
import { useSharedFormContext } from '../contexts/share-context';
import { useFormContext } from '../contexts/form-context';
import { useUserContext } from '../contexts/user-context';

const ShareForm = () => {
  const [formId, setFormId] = useState('');
  const [userId, setUserId] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Utilizando os contextos
  const { shareForm, loading } = useSharedFormContext();
  const { forms, loading: formsLoading } = useFormContext();
  const { users, loading: usersLoading } = useUserContext();

  

  const handleShare = async () => {
    setError(null);
    setSuccess(null);

    try {
      await shareForm(Number(formId), Number(userId));
      setSuccess('Formulário compartilhado com sucesso!');
      setFormId('');
      setUserId('');
    } catch (error) {
      setError(error.message || 'Erro ao compartilhar formulário');
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Compartilhar Formulário
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

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
    </Box>
  );
};

export default ShareForm;