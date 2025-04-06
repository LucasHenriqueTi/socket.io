import { createContext, useContext, useState, useCallback, Children } from 'react';
import { getForms, createForm } from '../services/form-service';

const FormContext = createContext();

const FormProvider = ({children}) => {
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(false);

    //função para buscar os formulários
    const fetchForms = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getForms();
            setForms(response.data.forms || response.data);
        } catch (error) {
            console.error('error ao buscar formulários:', error);
        } finally {
            setLoading(false);
        }

});

    // Função para adicionar um novo formulário
    const addForm = useCallback(async (name, userId) => {
        try {
            setLoading(true);
            const response = await createForm( name, userId );
            setForms(prev => [...prev, response.data]);
            return response;
        } catch (error) {
            console.error('Erro ao criar formulário:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [fetchForms]);

    return (
        <FormContext.Provider value={{ forms, loading, fetchForms, addForm }}>
            {children}
        </FormContext.Provider>
    );

}

export const useFormContext = () => useContext(FormContext);
export default FormProvider;