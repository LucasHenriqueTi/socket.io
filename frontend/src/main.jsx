import React from 'react'
import ReactDOM from 'react-dom/client'
import UserForm from './components/UserForm'
import UserList from './components/UserList'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <>
    <UserForm />
    <UserList />
    </>
  </React.StrictMode>
)