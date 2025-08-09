import { useState, ChangeEvent, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import IconifyIcon from 'components/base/IconifyIcon';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import DataGridFooter from 'components/common/DataGridFooter';
import NoRowsOverlay from 'components/common/NoRowsOverlay';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from 'store';
import { fetchNotificationList, fetchUnreadNotificationCount } from 'store/notificationSlice';
import { markNotificationAsRead, markAllNotificationsAsRead } from 'api/notification/notification';

const NotificationList = () => {
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { data: notifications, loading: notificationsLoading } = useSelector(
    (state: RootState) => state.notifications.notifications,
  );
  const { count: unreadCount, loading: unreadCountLoading } = useSelector(
    (state: RootState) => state.notifications.unreadCount,
  );

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('_id');
    const role = localStorage.getItem('role');

    if (!token) return;

    if (!notifications && !notificationsLoading) {
      if (role === 'Admin') {
        dispatch(fetchNotificationList({}));
      } else if (userId) {
        dispatch(fetchNotificationList({ userId }));
      }
    }
    if (unreadCount === null && !unreadCountLoading) {
      if (role === 'Admin') {
        dispatch(fetchUnreadNotificationCount());
      } else if (userId) {
        dispatch(fetchUnreadNotificationCount(userId));
      }
    }
  }, [dispatch, notifications, notificationsLoading, unreadCount, unreadCountLoading]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      setLoading(true);
      await markNotificationAsRead(notificationId);
      toast.success('Notification marked as read');
      // Refresh notifications and unread count
      const userId = localStorage.getItem('_id');
      const role = localStorage.getItem('role');
      if (role === 'Admin') {
        dispatch(fetchNotificationList({}));
        dispatch(fetchUnreadNotificationCount());
      } else if (userId) {
        dispatch(fetchNotificationList({ userId }));
        dispatch(fetchUnreadNotificationCount(userId));
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as { message?: string })?.message || 'Failed to mark notification as read';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('_id');
      const role = localStorage.getItem('role');

      if (role === 'Admin') {
        await markAllNotificationsAsRead('');
        toast.success('All notifications marked as read');
        // Refresh notifications and unread count
        dispatch(fetchNotificationList({}));
        dispatch(fetchUnreadNotificationCount());
      } else if (userId) {
        await markAllNotificationsAsRead(userId);
        toast.success('All notifications marked as read');
        // Refresh notifications and unread count
        dispatch(fetchNotificationList({ userId }));
        dispatch(fetchUnreadNotificationCount(userId));
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as { message?: string })?.message || 'Failed to mark all notifications as read';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotifications =
    notifications?.notifications?.filter(
      (notification) =>
        (notification.title?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
        (notification.taskId?.toLowerCase() || '').includes(searchText.toLowerCase()),
    ) || [];

  const columns: GridColDef[] = [
    {
      field: '_id',
      headerName: 'Task ID',
      flex: 1,
      minWidth: 220,
      renderCell: (params: GridRenderCellParams) => (
        <Stack alignItems="center" height="100%">
          <Typography variant="body2" color="text.secondary">
            {params.value}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'title',
      headerName: 'Task Title',
      flex: 2,
      minWidth: 250,
      renderCell: (params: GridRenderCellParams) => (
        <Stack alignItems="center" height="100%">
          <Typography
            variant="body2"
            sx={{
              fontWeight: params.row.isRead ? 400 : 600,
              color: params.row.isRead ? 'text.secondary' : 'text.primary',
            }}
          >
            {params.value || 'N/A'}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'message',
      headerName: 'Message',
      flex: 2,
      minWidth: 400,
      renderCell: (params: GridRenderCellParams) => (
        <Stack alignItems="center" height="100%">
          <Typography
            variant="body2"
            sx={{
              fontWeight: params.row.isRead ? 400 : 600,
              color: params.row.isRead ? 'text.secondary' : 'text.primary',
            }}
          >
            {params.value}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 2,
      minWidth: 120,
      renderCell: (params) => {
        const color =
          params.value === 'in progress'
            ? 'primary'
            : params.value === 'completed'
              ? 'success'
              : params.value === 'pending'
                ? 'warning'
                : 'info';
        return <Chip label={params.value} size="small" color={color} />;
      },
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      flex: 2,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Stack alignItems="center" height="100%">
          <Typography variant="body2" color="text.secondary">
            {dayjs(params.value).format('MMM DD, YYYY HH:mm')}
          </Typography>
        </Stack>
      ),
    },
    {
      field: 'isRead',
      headerName: 'Read',
      flex: 2,
      minWidth: 100,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value ? 'Read' : 'Unread'}
          size="small"
          color={params.value ? 'default' : 'primary'}
        />
      ),
    },

    {
      field: 'action',
      headerName: 'Action',
      headerAlign: 'right' as const,
      align: 'right' as const,
      editable: false,
      sortable: false,
      flex: 2,
      minWidth: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Button
          size="small"
          variant="outlined"
          onClick={() => handleMarkAsRead(params.row._id)}
          disabled={loading || params.row.isRead}
        >
          Mark as Read
        </Button>
      ),
    },
  ];

  const notificationsWithId = filteredNotifications.map((notification) => ({
    ...notification,
    id: notification._id,
  }));

  return (
    <Stack spacing={3} width={1} direction="column" p={3.5}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h4" fontWeight={700}>
          Notifications
        </Typography>
        <Button
          variant="outlined"
          onClick={handleMarkAllAsRead}
          disabled={loading || !unreadCount || unreadCount === 0}
          startIcon={<IconifyIcon icon="hugeicons:check-double" />}
        >
          Mark All as Read
        </Button>
      </Stack>

      <TextField
        variant="filled"
        size="small"
        placeholder="Search notifications..."
        value={searchText}
        onChange={handleInputChange}
        sx={{ width: 1, maxWidth: 450 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconifyIcon icon={'mynaui:search'} />
            </InputAdornment>
          ),
        }}
      />

      <DataGrid
        autoHeight
        density="standard"
        disableColumnResize
        disableColumnMenu
        disableColumnSelector
        disableRowSelectionOnClick
        columns={columns}
        rows={notificationsWithId}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        autosizeOptions={{
          includeOutliers: true,
          includeHeaders: false,
          outliersFactor: 1,
          expand: true,
        }}
        slots={{
          pagination: DataGridFooter,
          noRowsOverlay: () => <NoRowsOverlay message="No notifications found" />,
          loadingOverlay: () => (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              height="400px"
              width="100%"
            >
              <CircularProgress />
            </Box>
          ),
        }}
        pageSizeOptions={[5, 10, 20]}
        getRowId={(row: { id: string }) => row.id}
        loading={notificationsLoading}
      />
    </Stack>
  );
};

export default NotificationList;
