import { createContext, useContext, useState, useCallback } from 'react';
import { shareForm as shareFormApi, getSharedForms } from '../services/shared-form-service';

const SharedFormContext = createContext();

 const SharedFormProvider = ({ children }) => {
    const [sharedForms, setSharedForms] = useState([]);
    const [loading, setLoading] = useState(false);

    // useState é usado para armazenar o estado do componente
    const fetchSharedForms = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getSharedForms();
            setSharedForms(response.data.sharedForms || response.data);
        } catch (error) {
            console.error('Error fetching shared forms:', error);
        } finally {
            setLoading(false);
        }
    }, []);
    
    // useCallback é usado para memorizar a função e evitar recriações desnecessárias
    const shareForm = useCallback(async (formId, userId) => {
        try {
            setLoading(true);
            const response = await shareFormApi({ formId, userId });
            setSharedForms(prev => [...prev, response.data]);
            return response;
        } catch (error) {
            console.error('Error sharing form:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <SharedFormContext.Provider value={{ 
            sharedForms, 
            loading, 
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
        throw new Error('useSharedFormContext must be used within a SharedFormProvider');
    }
    return context;
};

export default SharedFormProvider;