import { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Typography, Chip } from '@mui/material';
import { getSharedForms } from '../services/shared-Form-Service';

const SharedFormsList = ({userId}) => {
    const [sharedForms, setSharedForms] = useState([]);

    useEffect(() => {
        const fetchSharedForms = async () => {
            try {
                const response = await getSharedForms(userId);
                setSharedForms(response.data.sharedForms);
                console.log(response.data.sharedForms);
            }catch (error) {
                console.error('erro ao buscar os formulários compartilhados', error);   
            }
        };
        fetchSharedForms();
    }, [userId]);

    return (
        <div>
        <Typography variant="h6" gutterBottom>
          Formulários Compartilhados com Você
        </Typography>
        <List>
          {sharedForms.map((shared) => (
            <ListItem key={shared.id}>
              <ListItemText
                primary={shared.form.name}
                secondary={
                  <>
                    <span>Compartilhado por: {shared.senderId}</span>
                    <Chip 
                      label={`ID: ${shared.formId}`} 
                      size="small" 
                      sx={{ ml: 1 }} 
                    />
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </div>
    );
    
}

export default SharedFormsList