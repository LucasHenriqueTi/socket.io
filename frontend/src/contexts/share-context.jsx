import { createContext, useContext, useState, useCallback } from 'react';
import { shareForm as shareFormApi, getSharedForms } from '../services/shared-form-service';

const SharedFormContext = createContext();

const SharedFormProvider = ({ children }) => {
    const [sharedForms, setSharedForms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchSharedForms = useCallback(async (userId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getSharedForms(userId);
            setSharedForms(response.data.sharedForms || []);
        } catch (error) {
            console.error('Erro ao buscar formulários compartilhados:', error);
            setError('Falha ao carregar formulários compartilhados');
        } finally {
            setLoading(false);
        }
    }, []);
    
    const shareForm = useCallback(async (formId, userId) => {
        try {
            setLoading(true);
            setError(null);
            const response = await shareFormApi({ formId, userId });
            setSharedForms(prev => [...prev, response.data]);
            return response;
        } catch (error) {
            console.error('Erro ao compartilhar formulário:', error);
            setError('Falha ao compartilhar formulário');
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <SharedFormContext.Provider value={{ 
            sharedForms, 
            loading, 
            error,
            fetchSharedForms, 
            shareForm 
        }}>
            {children}
        </SharedFormContext.Provider>
    );
};

export const useSharedFormContext = () => {
    const context = useContext(SharedFormContext);
    if (!context) {
        throw new Error('useSharedFormContext deve ser usado dentro de um SharedFormProvider');
    }
    return context;
};

export default SharedFormProvider;