import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { toast } from 'react-toastify';
import { changePassword } from 'api/auth/login';

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  required?: boolean;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  open,
  onClose,
  onSuccess,
  required = false,
}) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [internalLoading, setInternalLoading] = useState(false);
  const [errors, setErrors] = useState<{
    oldPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const handleSubmit = async () => {
    const newErrors: {
      oldPassword?: string;
      newPassword?: string;
      confirmPassword?: string;
    } = {};

    // Validation
    if (!oldPassword.trim()) {
      newErrors.oldPassword = 'Old password is required';
    }
    if (!newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'New password must be at least 6 characters';
    }
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setInternalLoading(true);
      try {
        await changePassword({ oldPassword, newPassword });
        toast.success('Password changed successfully!');
        // Set needsPasswordChange to false after successful password change
        localStorage.setItem('needsPasswordChange', 'false');
        onSuccess?.();
        onClose();
        // Reset form
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setErrors({});
      } catch (error: unknown) {
        const errorMessage =
          (error as { message?: string })?.message || 'Failed to change password.';
        toast.error(errorMessage);
      } finally {
        setInternalLoading(false);
      }
    }
  };

  const handleCancel = () => {
    // If required, don't allow closing without changing password
    if (required) {
      toast.error('You must change your password before continuing.');
      return;
    }

    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={required ? undefined : handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle>{required ? 'Password Change Required' : 'Change Password'}</DialogTitle>
      <DialogContent>
        {required && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            For security reasons, you must change your password before continuing.
          </Typography>
        )}
        <Stack spacing={3} mt={1} direction="column">
          {/* Old Password Field */}
          <Stack direction="column" spacing={0.5} width={1}>
            <Typography variant="subtitle2" fontWeight={600}>
              Old Password
            </Typography>
            <TextField
              type={showOldPassword ? 'text' : 'password'}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              fullWidth
              placeholder="Enter your current password"
              size="small"
              required
              error={!!errors.oldPassword}
              helperText={errors.oldPassword}
              disabled={internalLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      edge="end"
                      disabled={internalLoading}
                    >
                      {showOldPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          {/* New Password Field */}
          <Stack direction="column" spacing={0.5} width={1}>
            <Typography variant="subtitle2" fontWeight={600}>
              New Password
            </Typography>
            <TextField
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              placeholder="Enter your new password"
              size="small"
              required
              error={!!errors.newPassword}
              helperText={errors.newPassword}
              disabled={internalLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      edge="end"
                      disabled={internalLoading}
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          {/* Confirm Password Field */}
          <Stack direction="column" spacing={0.5} width={1}>
            <Typography variant="subtitle2" fontWeight={600}>
              Confirm New Password
            </Typography>
            <TextField
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              placeholder="Confirm your new password"
              size="small"
              required
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              disabled={internalLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      disabled={internalLoading}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        {!required && (
          <Button onClick={handleCancel} disabled={internalLoading}>
            Cancel
          </Button>
        )}
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={internalLoading}
          startIcon={internalLoading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {internalLoading ? 'Changing Password...' : 'Change Password'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangePasswordModal;
