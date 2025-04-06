// src/app.jsx
import React, { useState } from 'react'
import { ThemeProvider, CssBaseline, Button } from '@mui/material'
import { lightTheme, darkTheme } from './theme'
import UsersPage from './pages/UsersPage'

export default function App() {
  const [darkMode, setDarkMode] = useState(false)

  const toggleTheme = () => {
    setDarkMode(!darkMode)
  }

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <div style={{ padding: '1rem' }}>
        <Button variant="contained" onClick={toggleTheme}>
          {darkMode ? 'Modo Claro' : 'Modo Escuro'}
        </Button>
        <UsersPage />
      </div>
    </ThemeProvider>
  )
}
