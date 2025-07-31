import { Box, Typography } from '@mui/material';

interface NoRowsOverlayProps {
  message?: string;
}

const NoRowsOverlay: React.FC<NoRowsOverlayProps> = ({ message = 'No data' }) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      width: '100%',
      minHeight: 120,
    }}
  >
    <Typography color="text.secondary" fontWeight={500}>
      {message}
    </Typography>
  </Box>
);

export default NoRowsOverlay; 