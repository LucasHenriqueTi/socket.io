import { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';
import { useFormContext } from '../contexts/form-context';
import { useUserContext } from '../contexts/user-context';

const FormList = () => {
    const { users } = useUserContext();
    const { forms, fetchForms } = useFormContext();

    useEffect(() => {
        fetchForms();
    }, []);

    return (
        <div>
            <Typography variant="h6" gutterBottom>Formulários</Typography>
            <List>
                {forms.map((form, index) => (
                    <ListItem key={index}>
                        <ListItemText
                            primary={form.name}
                            secondary={`ID: ${form.id} | Criado por: ${form.userId}`}
                        />
                    </ListItem>
                ))}
            </List>
        </div>
    )
}

export default FormList