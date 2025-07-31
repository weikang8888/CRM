import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

interface GeneratedPasswordModalProps {
  open: boolean;
  password: string;
  onClose: () => void;
  title?: string;
}

const GeneratedPasswordModal: React.FC<GeneratedPasswordModalProps> = ({
  open,
  password,
  onClose,
  title = 'Generated Password',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (password) {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" gutterBottom>
          Please copy and save this password. It will not be shown again.
        </Typography>
        <Typography
          variant="h6"
          sx={{
            bgcolor: 'grey.100',
            p: 2,
            borderRadius: 1,
            textAlign: 'center',
            wordBreak: 'break-all',
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: 1,
            cursor: 'pointer',
            userSelect: 'all',
            transition: 'background 0.2s',
            '&:hover': { bgcolor: 'grey.200' },
          }}
          onClick={handleCopy}
          title="Click to copy"
        >
          {password}
        </Typography>
        {copied && (
          <Typography
            variant="caption"
            color="success.main"
            sx={{ display: 'block', textAlign: 'center', mt: 1 }}
          >
            Copied!
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GeneratedPasswordModal; 