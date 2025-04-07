import { useState } from 'react'
import { ThemeProvider, CssBaseline, Button, Box } from '@mui/material'
import { BrowserRouter } from 'react-router-dom'
import { lightTheme, darkTheme } from './theme'
import { AuthProvider } from './contexts/auth-context'
import AppRoutes from '../src/router'

export default function App() {
  const [darkMode, setDarkMode] = useState(true)

  const toggleTheme = () => {
    setDarkMode(!darkMode)
  }

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Box sx={{ padding: '1rem' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Button variant="contained" onClick={toggleTheme}>
                {darkMode ? 'Modo Claro' : 'Modo Escuro'}
              </Button>
              
            </Box>
            
            <AppRoutes />
          </Box>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}