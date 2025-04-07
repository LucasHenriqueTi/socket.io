import { useEffect} from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';
import { useFormContext } from '../contexts/form-context';

// listar formulários
const FormList = () => {
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
                            secondary={`ID: ${form.id} | Criado por:  ${form.user?.name ?? 'Desconhecido'}`}
                        />
                    </ListItem>
                ))}
            </List>
        </div>
    )
}

export default FormList