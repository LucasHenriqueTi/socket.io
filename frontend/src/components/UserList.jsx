import { useEffect } from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';
import { useUserContext } from "../contexts/user-contex";


const UserList = () => {
    const {users ,fetchUsers} = useUserContext();
    
    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div>
            <Typography variant="h6" gutterBottom>Usuários Cadastrados</Typography>
            <List>
                {users.map((user, index) => (
                    <ListItem key={index}>
                        <ListItemText primary={user.name} secondary={`ID: ${user.id}`} />
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default UserList;