// src/contexts/share-context.js
import { createContext, useContext, useState, useCallback } from 'react';
import { shareForm as shareFormApi, getSharedForms } from '../services/shared-form-service';
import { useSocket } from './socket-context';

const SharedFormContext = createContext();

const SharedFormProvider = ({ children }) => {
    const [sharedForms, setSharedForms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { socket } = useSocket();

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
    
    // shareForm é uma função que compartilha um formulário com um destinatário
    const shareForm = useCallback(async (formId, userId ) => {
        try {
            setLoading(true);
            setError(null);
            const response = await shareFormApi({ formId, userId });
            setSharedForms(prev => [...prev, response.data]);
            
            // Notifica o destinatário via Socket.io se estiver conectado
            if (socket) {
                socket.emit('share-form', { 
                    formId, 
                    userId,
                    senderId: response.data.senderId 
                });
            }
            
            return response;
        } catch (error) {
            console.error('Erro ao compartilhar formulário:', error);
            setError('Falha ao compartilhar formulário');
            throw error;
        } finally {
            setLoading(false);
        }
    }, [socket]);

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