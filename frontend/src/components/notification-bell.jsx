import { useState } from 'react';
import { useSocket } from '../contexts/socket-context';
import { Badge, Popover, List, ListItem, ListItemText, IconButton, Typography, Button, Box } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate } from 'react-router-dom';

const NotificationBell = () => {
  const { notifications, markNotificationAsRead, clearNotifications } = useSocket();
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notification) => {
    markNotificationAsRead(notification.id);
    if (notification.formId) {
      navigate(`/forms/${notification.formId}`);
    }
    handleClose();
  };

  const handleClearAll = () => {
    clearNotifications();
    handleClose();
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleOpen}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ 
          maxHeight: '80vh',
          '& .MuiPaper-root': { width: 360 }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1
          }}>
            <Typography variant="h6">Notificações</Typography>
            {notifications.length > 0 && (
              <Button 
                size="small" 
                onClick={handleClearAll}
                disabled={notifications.length === 0}
              >
                Limpar todas
              </Button>
            )}
          </Box>

          {notifications.length === 0 ? (
            <Typography variant="body2" sx={{ p: 2, textAlign: 'center' }}>
              Nenhuma notificação
            </Typography>
          ) : (
            <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
              {notifications.map((notification) => (
                <ListItem 
                  key={notification.id}
                  button
                  onClick={() => handleNotificationClick(notification)}
                  sx={{
                    bgcolor: notification.read ? 'background.paper' : 'action.selected',
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <ListItemText
                    primary={notification.message}
                    secondary={new Date(notification.timestamp).toLocaleString()}
                    primaryTypographyProps={{
                      fontWeight: notification.read ? 'normal' : 'bold'
                    }}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Popover>
    </>
  );
};

export default NotificationBell;