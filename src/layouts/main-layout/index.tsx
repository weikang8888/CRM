import { useState, PropsWithChildren, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Sidebar from 'layouts/main-layout/sidebar';
import Topbar from 'layouts/main-layout/topbar';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import { fetchProfile } from 'store/profileSlice';
import { fetchNotificationList } from 'store/notificationSlice';

const MainLayout = ({ children }: PropsWithChildren) => {
  const dispatch = useDispatch<AppDispatch>();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const { data: profile, loading: profileLoading } = useSelector(
    (state: RootState) => state.profile,
  );

  const { data: notifications, loading: notificationsLoading } = useSelector(
    (state: RootState) => state.notifications.notifications,
  );

  useEffect(() => {
    if (!profile && !profileLoading) dispatch(fetchProfile());
  }, [dispatch, profile, profileLoading]);

  useEffect(() => {
    if (profile?._id && !notifications && !notificationsLoading) {
      const role = localStorage.getItem('role');
      if (role === 'Admin') {
        dispatch(fetchNotificationList({}));
      } else {
        dispatch(fetchNotificationList({ userId: profile._id }));
      }
    }
  }, [dispatch, profile?._id, notifications, notificationsLoading]);

  return (
    <Stack width={1} minHeight="100vh">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} setIsClosing={setIsClosing} />
      <Stack
        component="main"
        direction="column"
        width={{ xs: 1, lg: 'calc(100% - 252px)' }}
        flexGrow={1}
      >
        <Topbar isClosing={isClosing} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        {children}
      </Stack>
    </Stack>
  );
};

export default MainLayout;
