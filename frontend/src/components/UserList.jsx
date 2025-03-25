import { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';
import { getUsers } from '../services/user-service';

const UserList = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getUsers();
                console.log("Dados da API:", response.data); // Depuração

                setUsers(response.data.users);
            } catch (error) {
                console.log('erro ao buscar usuários', error);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div>
            <Typography variant="h6" gutterBottom>Usuários Cadastrados</Typography>
            <List>
                {users.map((user) => (
                    <ListItem key={user.id}>
                        <ListItemText primary={user.name} secondary={`ID: ${user.id}`} />
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default UserList;