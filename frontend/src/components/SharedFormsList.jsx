import { useEffect, useState } from 'react';
import { useSocket } from '../contexts/socket-context';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const SharedFormsList = () => {
  const { socket } = useSocket();
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (!socket) return;

    const handleFormShared = (data) => {
      console.log('Notificação recebida:', data);
      setNotification({
        message: data.message,
        severity: 'info',
      });
    };

    socket.on('form-shared', handleFormShared);

    return () => {
      socket.off('form-shared', handleFormShared);
    };
  }, [socket]);

  const handleClose = () => {
    setNotification(null);
  };

  return (
    <>
      <div>Component para listar formulários compartilhados.</div>

      <Snackbar
        open={!!notification}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        {notification && (
          <Alert onClose={handleClose} severity={notification.severity}>
            {notification.message}
          </Alert>
        )}
      </Snackbar>
    </>
  );
};

export default SharedFormsList;
