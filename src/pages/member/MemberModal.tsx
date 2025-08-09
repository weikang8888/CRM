import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import CircularProgress from '@mui/material/CircularProgress';
import { MemberPayload } from '../../api/member/member';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPositions } from 'store/profileSlice';
import { RootState, AppDispatch } from 'store';

interface MemberModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (member: MemberPayload) => void;
  initialValues?: Partial<MemberPayload>;
  mode?: 'create' | 'edit';
}

const MemberModal: React.FC<MemberModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialValues,
  mode = 'create',
}) => {
  const [firstName, setFirstName] = useState(initialValues?.firstName || '');
  const [lastName, setLastName] = useState(initialValues?.lastName || '');
  const [email, setEmail] = useState(initialValues?.email || '');
  const [position, setPosition] = useState(initialValues?.position || '');
  const [avatar, setAvatar] = useState<File | string | undefined>(initialValues?.avatar);
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    position?: string;
  }>({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { positions, positionsLoading } = useSelector((state: RootState) => state.profile);

  useEffect(() => {
    if (!positions.length && !positionsLoading) {
      dispatch(fetchPositions());
    }
  }, [positions, positionsLoading, dispatch]);

  React.useEffect(() => {
    setFirstName(initialValues?.firstName || '');
    setLastName(initialValues?.lastName || '');
    setEmail(initialValues?.email || '');
    setPosition(initialValues?.position || '');
    setAvatar(initialValues?.avatar);
  }, [initialValues, open]);

  const handleCreate = async () => {
    const newErrors: { firstName?: string; lastName?: string; email?: string; position?: string } =
      {};
    if (!firstName) newErrors.firstName = 'First name is required';
    if (!lastName) newErrors.lastName = 'Last name is required';
    if (!email) newErrors.email = 'Email is required';
    if (!position) newErrors.position = 'Position is required';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitLoading(true);
    try {
      if (onSubmit) {
        await onSubmit({ firstName, lastName, email, position, avatar });
      }
      setFirstName('');
      setLastName('');
      setEmail('');
      setPosition('');
      setAvatar(undefined);
      onClose();
    } catch (error) {
      // Error handling is done in the parent component
      console.error('Member submission error:', error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCancel = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPosition('');
    setAvatar(undefined);
    setErrors({});
    onClose();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="xs" fullWidth>
      <DialogTitle>{mode === 'edit' ? 'Edit Member' : 'Create Member'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1} direction="column" alignItems="center">
          {/* Avatar Upload Area */}
          <Box position="relative" display="inline-block">
            <Avatar
              src={
                typeof avatar === 'string'
                  ? avatar
                  : avatar
                    ? URL.createObjectURL(avatar)
                    : undefined
              }
              sx={{ width: 96, height: 96, fontSize: 40 }}
            />
            <IconButton
              color="primary"
              disabled={submitLoading}
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                bgcolor: 'background.paper',
                boxShadow: 1,
                '&:hover': { bgcolor: 'grey.100' },
                width: 36,
                height: 36,
              }}
              component="label"
            >
              <EditIcon />
              <input
                accept="image/*"
                id="avatar"
                type="file"
                style={{ display: 'none' }}
                onChange={handleAvatarChange}
              />
            </IconButton>
          </Box>
          {/* First and Last Name Fields in one row */}
          <Stack direction="row" spacing={2} alignItems="center" width={1}>
            <Stack direction="column" spacing={0.5} width={1}>
              <Typography variant="subtitle2" fontWeight={600}>
                First Name
              </Typography>
              <TextField
                label=""
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                fullWidth
                placeholder="Enter first name"
                size="small"
                error={!!errors.firstName}
                disabled={submitLoading}
              />
              {errors.firstName && <FormHelperText error>{errors.firstName}</FormHelperText>}
            </Stack>
            <Stack direction="column" spacing={0.5} width={1}>
              <Typography variant="subtitle2" fontWeight={600}>
                Last Name
              </Typography>
              <TextField
                label=""
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                fullWidth
                placeholder="Enter last name"
                size="small"
                error={!!errors.lastName}
                disabled={submitLoading}
              />
              {errors.lastName && <FormHelperText error>{errors.lastName}</FormHelperText>}
            </Stack>
          </Stack>
          {/* Email Field */}
          <Stack direction="column" spacing={0.5} width={1}>
            <Typography variant="subtitle2" fontWeight={600}>
              Email
            </Typography>
            <TextField
              label=""
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              placeholder="Enter member email"
              size="small"
              type="email"
              disabled={mode === 'edit' || submitLoading}
              error={!!errors.email}
            />
            {errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
          </Stack>
          {/* Position Field */}
          <Stack direction="column" spacing={0.5} width={1}>
            <Typography variant="subtitle2" fontWeight={600}>
              Position
            </Typography>
            <Select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              fullWidth
              size="small"
              displayEmpty
              error={!!errors.position}
              disabled={submitLoading}
            >
              <MenuItem value="" disabled>
                {positionsLoading ? 'Loading...' : 'Select position'}
              </MenuItem>
              {positions.map((pos) => (
                <MenuItem key={pos} value={pos}>
                  {pos}
                </MenuItem>
              ))}
            </Select>
            {errors.position && <FormHelperText error>{errors.position}</FormHelperText>}
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="inherit" disabled={submitLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleCreate}
          variant="contained"
          color="primary"
          disabled={submitLoading}
          startIcon={submitLoading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {submitLoading
            ? mode === 'edit'
              ? 'Saving...'
              : 'Creating...'
            : mode === 'edit'
              ? 'Save'
              : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MemberModal;
