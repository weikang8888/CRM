import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import Menu from '@mui/material/Menu';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconifyIcon from 'components/base/IconifyIcon';
import Link from '@mui/material/Link';
import PersonIcon from '@mui/icons-material/Person';

interface MenuItems {
  id: number;
  title: string;
  icon: string;
  path: string;
}

const menuItems: MenuItems[] = [
  {
    id: 1,
    title: 'View Profile',
    icon: 'hugeicons:user-circle-02',
    path: '/profile',
  },
  // {
  //   id: 2,
  //   title: 'Account Settings',
  //   icon: 'hugeicons:account-setting-02',
  //   path: '#',
  // },
  {
    id: 3,
    title: 'Notifications',
    icon: 'solar:bell-outline',
    path: '/notifications',
  },
  // {
  //   id: 4,
  //   title: 'Switch Account',
  //   icon: 'hugeicons:user-switch',
  //   path: '#',
  // },
  {
    id: 5,
    title: 'Help Center',
    icon: 'carbon:help',
    path: '#',
  },
  {
    id: 6,
    title: 'Logout',
    icon: 'hugeicons:logout-03',
    path: '/login',
  },
];

const ProfileMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const profile = useSelector((state: RootState) => state.profile.data);
  const name =
    profile && (profile.firstName || profile.lastName)
      ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || '-'
      : '-';
  const email = profile?.email;
  const avatar = profile?.avatar;

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('_id');
    localStorage.removeItem('needsPasswordChange');
    handleProfileMenuClose();
    window.location.href = '/login';
  };

  return (
    <>
      <ButtonBase
        onClick={handleProfileClick}
        aria-controls={open ? 'account-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        disableRipple
      >
        <Avatar
          src={avatar}
          sx={{
            height: 48,
            width: 48,
            bgcolor: 'primary.main',
          }}
        >
          {!avatar ? <PersonIcon /> : null}
        </Avatar>
      </ButtonBase>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        sx={{
          mt: 1.5,
          '& .MuiList-root': {
            p: 0,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box p={1}>
          <MenuItem onClick={handleProfileMenuClose} sx={{ '&:hover': { bgcolor: 'info.light' } }}>
            <Avatar src={avatar} sx={{ mr: 1, height: 42, width: 42 }}>
              {!avatar ? <PersonIcon /> : null}
            </Avatar>
            <Stack direction="column">
              <Typography variant="body2" color="text.primary" fontWeight={600}>
                {name || 'User'}
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={400}>
                {email || 'user@example.com'}
              </Typography>
            </Stack>
          </MenuItem>
        </Box>

        <Divider sx={{ my: 0 }} />

        <Box p={1}>
          {menuItems.map((item) => {
            if (item.title === 'Logout') {
              return (
                <MenuItem key={item.id} onClick={handleLogout} sx={{ py: 1 }}>
                  <Link
                    href={item.path}
                    underline="none"
                    color="inherit"
                    sx={{ display: 'flex', alignItems: 'center', width: '100%' }}
                  >
                    <ListItemIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 'h5.fontSize' }}>
                      <IconifyIcon icon={item.icon} />
                    </ListItemIcon>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                      {item.title}
                    </Typography>
                  </Link>
                </MenuItem>
              );
            }
            return (
              <MenuItem key={item.id} onClick={handleProfileMenuClose} sx={{ py: 1 }}>
                <Link
                  href={item.path}
                  underline="none"
                  color="inherit"
                  sx={{ display: 'flex', alignItems: 'center', width: '100%' }}
                >
                  <ListItemIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 'h5.fontSize' }}>
                    <IconifyIcon icon={item.icon} />
                  </ListItemIcon>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    {item.title}
                  </Typography>
                </Link>
              </MenuItem>
            );
          })}
        </Box>
      </Menu>
    </>
  );
};

export default ProfileMenu;
