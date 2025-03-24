import {toPng} from 'html-to-image'
import {
    Typography,
    Box,
  } from '@mui/material';

  const Thumbnail = ({user}) => {
    return (
        <Box
      sx={{
        padding: 2,
        backgroundColor: '#f0f0f0',
        borderRadius: 2,
        textAlign: 'center',
        border: '1px solid #ccc',
      }}
    >
      <Typography variant="h6">{user.name}</Typography>
      <Typography variant="body2">Idade: {user.age}</Typography>
      <Typography variant="body2">ID: {user.id}</Typography>
    </Box>
    )  
  }

  export default Thumbnail;