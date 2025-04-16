import React from 'react'
import ReactDOM from 'react-dom/client'
import UserProvider from '../src/contexts/user-context';
import FormProvider from '../src/contexts/form-context';
import SharedFormProvider from '../src/contexts/share-context';
import SocketProvider from '../src/contexts/socket-context';
import { AuthProvider } from './contexts/auth-context'

import App from './app';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SocketProvider>
      <AuthProvider>
      <UserProvider>
        <FormProvider>
          <SharedFormProvider>
            <App />
          </SharedFormProvider>
        </FormProvider>
      </UserProvider>
      </AuthProvider>
    </SocketProvider>
  </React.StrictMode>
);