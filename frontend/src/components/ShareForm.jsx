import { useState, useEffect } from 'react';
import { Button, MenuItem, Box, Typography, TextField } from '@mui/material';

import { shareForm } from '../services/shared-form-service';
import { getForms } from '../services/form-service'
import { getUsers } from '../services/user-service'

const ShareForm = () => {
    const [formId, setFormId] = useState('');
    const [userId, setUserId] = useState('');
    const [forms, setForms] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [formsRes, usersRes] = await Promise.all([
                    getForms(),
                    getUsers()
                ]);
                setForms(formsRes.data.forms);
                setUsers(usersRes.data.users);
            }catch (error) {
                console.error('erro ao buscar dados', error)
            }
        };
        fetchData();
    }, []);

    const handleShare = async () => {
        try {
            await shareForm({
                formId: Number(formId),
                userId: Number(userId)
            });
            alert('formulário compartilhado com sucesso!');
            setFormId('');
            setUserId('');
            console.log('formulário compartilhado com sucesso!', formId, userId);
        } catch (error) {
            console.error('error ao compatilhar formulário', error)
        }
    }

    return (
<Box>
      <Typography variant="h6" gutterBottom>Compartilhar Formulário</Typography>
      <TextField
        select
        label="Formulário"
        value={formId}
        onChange={(e) => setFormId(e.target.value)}
        fullWidth
        margin="normal"
      >
        {forms.map((form) => (
          <MenuItem key={form.id} value={form.id}>
            {form.name} (ID: {form.id})
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Usuário"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        fullWidth
        margin="normal"
      >
        {users.map((user) => (
          <MenuItem key={user.id} value={user.id}>
            {user.name} (ID: {user.id})
          </MenuItem>
        ))}
      </TextField>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleShare}
        disabled={!formId || !userId}
        sx={{ mt: 2 }}
      >
        Compartilhar
      </Button>
    </Box>
    );
}

export default ShareForm;