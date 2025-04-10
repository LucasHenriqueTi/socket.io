import { createContext, useContext, useState, useCallback } from 'react';
import { getUsers, createUser } from '../services/user-service';

const UserContext = createContext();

// UserContext.Provider é um componente que fornece o contexto para os componentes filhos
const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    // useCallback é usado para memorizar a função e evitar que ela seja recriada em cada renderização
    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getUsers();
            setUsers(response.data.users);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Função para adicionar um novo usuário
    // O useCallback é usado para evitar que a função seja recriada em cada renderização
    const addUser = useCallback(async (name) => {
        const response = await createUser({name});
        setUsers(prev => [...prev, response.data]);
        await fetchUsers();
        return response;
    },[]);

    return (
        <UserContext.Provider value={{ users, loading, fetchUsers, addUser }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUserContext = () => useContext(UserContext);
export default UserProvider;