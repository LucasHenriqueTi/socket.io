import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Box, AppBar, Toolbar, Typography, Container } from '@mui/material/core'
import Users from './pages/Users'
import Forms from './pages/Forms'
import Shared from './pages/Shared'

export default function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">GeraForm</Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Routes>
            <Route path="/" element={<Users />} />
            <Route path="/forms" element={<Forms />} />
            <Route path="/shared" element={<Shared />} />
          </Routes>
        </Box>
      </Container>
    </Router>
  )
}