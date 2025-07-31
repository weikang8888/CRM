import { useState, PropsWithChildren, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Sidebar from 'layouts/main-layout/sidebar';
import Topbar from 'layouts/main-layout/topbar';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import { fetchProfile } from 'store/profileSlice';

const MainLayout = ({ children }: PropsWithChildren) => {
  const dispatch = useDispatch<AppDispatch>();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const { data: profile, loading: profileLoading } = useSelector(
    (state: RootState) => state.profile,
  );
  useEffect(() => {
    if (!profile && !profileLoading) dispatch(fetchProfile());
  }, [dispatch, profile, profileLoading]);

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
