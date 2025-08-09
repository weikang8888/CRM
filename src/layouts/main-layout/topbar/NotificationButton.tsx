import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from 'store';
import { fetchUnreadNotificationCount, fetchNotificationList } from 'store/notificationSlice';
import { markNotificationAsRead, markAllNotificationsAsRead } from 'api/notification/notification';
import Menu from '@mui/material/Menu';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemIcon from '@mui/material/ListItemIcon';
import Chip from '@mui/material/Chip';
import IconifyIcon from 'components/base/IconifyIcon';
import { useEffect } from 'react';

const NotificationButton = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { data: profile } = useSelector((state: RootState) => state.profile);
  const { data: notifications, loading } = useSelector(
    (state: RootState) => state.notifications.notifications,
  );
  const { count: unreadCount } = useSelector((state: RootState) => state.notifications.unreadCount);

  useEffect(() => {
    if (profile?._id) {
      dispatch(fetchUnreadNotificationCount(profile._id));
    }
  }, [dispatch, profile?._id]);

  const handleNotificationButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAllAsRead = async () => {
    try {
      const userId = localStorage.getItem('_id');
      const role = localStorage.getItem('role');

      if (role === 'Admin') {
        await markAllNotificationsAsRead('');
        // Refresh notifications and unread count
        dispatch(fetchNotificationList({}));
        dispatch(fetchUnreadNotificationCount());
      } else if (userId) {
        await markAllNotificationsAsRead(userId);
        // Refresh notifications and unread count
        dispatch(fetchNotificationList({ userId }));
        dispatch(fetchUnreadNotificationCount(userId));
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
    handleNotificationMenuClose();
  };

  const handleViewAllNotifications = () => {
    navigate('/notifications');
    handleNotificationMenuClose();
  };

  const handleNotificationClick = async (notificationId: string, isRead: boolean) => {
    // Only call API if notification is not read
    if (!isRead) {
      try {
        await markNotificationAsRead(notificationId);
        // Refresh both unread count and notification list
        if (profile?._id) {
          dispatch(fetchUnreadNotificationCount(profile._id));
          dispatch(fetchNotificationList({ userId: profile._id }));
        }
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }
    handleNotificationMenuClose();
  };

  return (
    <div>
      <IconButton size="large" onClick={handleNotificationButtonClick}>
        <Badge badgeContent={unreadCount || 0} color="error" max={99}>
          <IconifyIcon icon="solar:bell-outline" />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        id="notification-menu"
        open={open}
        onClose={handleNotificationMenuClose}
        sx={{
          mt: 1.5,
          '& .MuiList-root': {
            p: 0,
            width: { xs: '100%', sm: 500 },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box p={1}>
          <MenuItem sx={{ '&:hover': { bgcolor: 'info.light' } }}>
            <Stack direction="column" width="100%">
              <Typography variant="body2" color="text.primary" fontWeight={600}>
                Notifications
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={400}>
                {unreadCount || 0} unread notifications
              </Typography>
            </Stack>
          </MenuItem>
        </Box>

        <Divider sx={{ my: 0 }} />

        <Box p={1} maxHeight={300} overflow="auto">
          {loading ? (
            <MenuItem>
              <Typography variant="body2" color="text.secondary">
                Loading notifications...
              </Typography>
            </MenuItem>
          ) : notifications?.notifications && notifications.notifications.length > 0 ? (
            notifications.notifications.slice(0, 5).map((notification) => (
              <MenuItem
                key={notification._id}
                onClick={() => handleNotificationClick(notification._id, notification.isRead)}
                sx={{
                  py: 1,
                  backgroundColor: notification.isRead ? 'transparent' : 'action.hover',
                  '&:hover': { bgcolor: 'info.light' },
                  position: 'relative',
                  cursor: 'pointer',
                }}
              >
                {!notification.isRead && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: 'error.main',
                      zIndex: 1,
                    }}
                  />
                )}
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  width="100%"
                  spacing={1}
                >
                  <Stack direction="column" sx={{ width: '70%', minWidth: '70%' }}>
                    <Typography
                      variant="body2"
                      color="text.primary"
                      fontWeight={500}
                      sx={{
                        whiteSpace: 'normal',
                        wordWrap: 'normal',
                      }}
                    >
                      {notification.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        whiteSpace: 'normal',
                        wordWrap: 'normal',
                      }}
                    >
                      {notification.message}
                    </Typography>
                  </Stack>
                  <Stack
                    direction="column"
                    alignItems="center"
                    spacing={1}
                    sx={{ width: '30%', minWidth: '30%' }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </Typography>
                    <Chip
                      label={notification.status}
                      size="small"
                      color={
                        notification.status === 'completed'
                          ? 'success'
                          : notification.status === 'in progress'
                            ? 'primary'
                            : notification.status === 'pending'
                              ? 'warning'
                              : 'info'
                      }
                      variant="outlined"
                    />{' '}
                  </Stack>
                </Stack>
              </MenuItem>
            ))
          ) : (
            <MenuItem>
              <Typography variant="body2" color="text.secondary">
                No notifications
              </Typography>
            </MenuItem>
          )}
        </Box>

        {notifications?.notifications && notifications.notifications.length > 0 && (
          <div>
            <Divider sx={{ my: 0 }} />
            <Box p={1}>
              <MenuItem
                onClick={handleMarkAllAsRead}
                sx={{
                  py: 1,
                  opacity: !unreadCount || unreadCount === 0 ? 0.5 : 1,
                  cursor: !unreadCount || unreadCount === 0 ? 'not-allowed' : 'pointer',
                }}
                disabled={!unreadCount || unreadCount === 0}
              >
                <ListItemIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 'h5.fontSize' }}>
                  <IconifyIcon icon="solar:check-circle-outline" />
                </ListItemIcon>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  Mark all as read
                </Typography>
              </MenuItem>
              <MenuItem onClick={handleViewAllNotifications} sx={{ py: 1 }}>
                <ListItemIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 'h5.fontSize' }}>
                  <IconifyIcon icon="solar:eye-outline" />
                </ListItemIcon>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  View all notifications
                </Typography>
              </MenuItem>
            </Box>
          </div>
        )}
      </Menu>
    </div>
  );
};

export default NotificationButton;
