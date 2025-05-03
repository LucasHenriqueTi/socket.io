import { Badge, IconButton, Popover, List, ListItem, ListItemText, Typography, Box } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useState } from 'react';
import { useNotifications } from '../contexts/notification-context';

const NotificationBell = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { notifications, unreadCount, markAsRead } = useNotifications();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'notification-popover' : undefined;

  return (
    <Box>
      <IconButton 
        color="inherit" 
        onClick={handleClick}
        aria-describedby={id}
        disabled={!unreadCount}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ width: 360, p: 2, maxHeight: 400, overflow: 'auto' }}>
          <Typography variant="h6" gutterBottom>
            Notificações {unreadCount > 0 && `(${unreadCount} novas)`}
          </Typography>
          {notifications.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Nenhuma notificação
            </Typography>
          ) : (
            <List dense>
              {notifications.map((notification) => (
                <ListItem 
                  key={notification.id}
                  sx={{ 
                    bgcolor: notification.read ? 'background.paper' : 'action.selected',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                  onClick={() => {
                    markAsRead(notification.id);
                    handleClose();
                  }}
                >
                  <ListItemText
                    primary={notification.message}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {notification.senderName}
                        </Typography>
                        {` - ${new Date(notification.timestamp).toLocaleString()}`}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Popover>
    </Box>
  );
}

export default NotificationBell;