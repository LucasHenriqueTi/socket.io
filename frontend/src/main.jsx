import React from 'react'
import ReactDOM from 'react-dom/client'
import UserProvider  from '../src/contexts/user-contex';
import App from './app';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
);