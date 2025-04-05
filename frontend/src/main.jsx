import React from 'react'
import ReactDOM from 'react-dom/client'
import UsersPage from './pages/UsersPage'
import UserProvider  from '../src/contexts/user-contex';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <UsersPage />
    </UserProvider>
  </React.StrictMode>
);