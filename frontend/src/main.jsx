import React from 'react'
import ReactDOM from 'react-dom/client'
import UserProvider from '../src/contexts/user-context';
import FormProvider from '../src/contexts/form-context';
import SharedFormProvider from '../src/contexts/share-context';
import App from './app';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <FormProvider>
        <SharedFormProvider>
          <App />
        </SharedFormProvider>
      </FormProvider>
    </UserProvider>
  </React.StrictMode>
);