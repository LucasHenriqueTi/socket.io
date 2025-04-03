import { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';
import { getForms } from '../services/form-service';

const FormList = () => {
    const [forms, setForms] = useState([]);

    useEffect(() => {
        const fetchForms = async () => {
            try {
                const response = await getForms();
                setForms(response.data.forms);
                console.log('dados do getForms', response)
            } catch (error) {
                console.error('erro ao buscar formulários', error);
            }
        };
        fetchForms();
    }, []);

    return (
        <div>
            <Typography variant="h6" gutterBottom>Formulários</Typography>
            <List>
                {forms.map((form) => (
                    <ListItem key={form.id}>
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