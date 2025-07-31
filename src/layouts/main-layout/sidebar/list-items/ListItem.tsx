import { useState } from 'react';
import { MenuItem } from 'routes/sitemap';
import Link from '@mui/material/Link';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconifyIcon from 'components/base/IconifyIcon';
import { useLocation } from 'react-router-dom';

const ListItem = ({ subheader, icon, path }: MenuItem) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isActive = path && location.pathname === path;

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <ListItemButton
      component={Link}
      href={path}
      onClick={handleClick}
      sx={{ mb: 2.5, bgcolor: isActive ? 'info.main' : null }}
    >
      <ListItemIcon>
        {icon && (
          <IconifyIcon
            icon={icon}
            fontSize="h4.fontSize"
            sx={{
              color: isActive ? 'text.primary' : null,
            }}
          />
        )}
      </ListItemIcon>
      <ListItemText
        primary={subheader}
        sx={{
          '& .MuiListItemText-primary': {
            color: isActive ? 'text.primary' : null,
          },
        }}
      />
    </ListItemButton>
  );
};

export default ListItem;
