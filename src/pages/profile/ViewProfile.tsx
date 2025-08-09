import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import { ProfileResponse, editProfile } from 'api/profile/profile';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from 'store';
import { fetchProfile } from 'store/profileSlice';
import { uploadPhoto } from 'api/upload/upload';
import { fetchPositions } from 'store/profileSlice';

const ViewProfile: React.FC = () => {
  const userRole = typeof window !== 'undefined' ? localStorage.getItem('role') : undefined;

  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState<ProfileResponse | null>(null);
  const [avatar, setAvatar] = useState<File | string | undefined>(undefined);
  const [submitLoading, setSubmitLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { data: profile, loading, positions, positionsLoading } = useSelector((state: RootState) => state.profile);

  useEffect(() => {
    if (!profile && !loading) {
      dispatch(fetchProfile());
    } else if (profile) {
      setEditValues(profile);
      setAvatar(profile.avatar);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, loading, dispatch]);

  useEffect(() => {
    if (isEditing && (userRole === 'Mentor' || userRole === 'Member')) {
      if (!positions.length && !positionsLoading) {
        dispatch(fetchPositions());
      }
    }
  }, [isEditing, userRole, positions, positionsLoading, dispatch]);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditValues(profile);
    setAvatar(profile?.avatar);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValues(profile);
    setAvatar(profile?.avatar);
  };

  const handleChange = (field: string, value: string) => {
    setEditValues((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSave = async () => {
    if (!editValues) return;

    setSubmitLoading(true);
    try {
      // Exclude email and role from the payload
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, email, role, ...payload } = editValues;
      let avatarUrl = avatar;
      if (avatar instanceof File && profile && profile._id) {
        const uploadResult = await uploadPhoto({
          type: 'profile',
          refId: profile._id,
          photo: avatar,
        });
        avatarUrl = uploadResult.avatar;
      }
      await editProfile({
        ...payload,
        avatar: typeof avatarUrl === 'string' ? avatarUrl : undefined,
      });
      toast.success('Profile updated successfully!');
      // Refresh profile after successful edit
      dispatch(fetchProfile());
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography color="error">Failed to load profile.</Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" gap={4} p={4} sx={{ backgroundColor: 'info.main' }}>
      {/* Section 1: Avatar + Name/Admin */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Grid container alignItems="center" spacing={3}>
          <Grid item container alignItems="center" gap={3}>
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <Avatar
                sx={{ width: 80, height: 80 }}
                src={
                  !avatar
                    ? undefined
                    : typeof avatar === 'string'
                      ? avatar
                      : avatar instanceof File
                        ? URL.createObjectURL(avatar)
                        : undefined
                }
              />
              {isEditing && (
                <IconButton
                  size="small"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: 'background.paper',
                    boxShadow: 1,
                    '&:hover': { backgroundColor: 'grey.100' },
                    transform: 'translate(25%, 25%)',
                  }}
                  aria-label="edit avatar"
                  component="label"
                >
                  <EditIcon fontSize="small" />
                  <input
                    accept="image/*"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleAvatarChange}
                  />
                </IconButton>
              )}
            </Box>
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                mt: 2,
              }}
            >
              <Typography variant="subtitle1" fontWeight={600}>
                {profile.lastName || '-'} {profile.firstName || '-'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {profile.role || '-'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Section 2: Personal Information */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h6">Personal Information</Typography>
          {isEditing ? (
            <Button variant="outlined" color="inherit" onClick={handleCancel}>
              Cancel
            </Button>
          ) : (
            <Button
              variant="contained"
              sx={{
                backgroundColor: 'primary.dark',
                color: 'common.white',
              }}
              onClick={handleEditClick}
            >
              Edit
            </Button>
          )}
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Box display="flex" flexDirection="column">
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                First Name
              </Typography>
              {isEditing ? (
                <TextField
                  size="small"
                  value={editValues ? editValues.firstName : ''}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  sx={{ mt: 0.5 }}
                />
              ) : (
                <Typography variant="body1" fontWeight={600}>
                  {profile.firstName || '-'}
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box display="flex" flexDirection="column">
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                Last Name
              </Typography>
              {isEditing ? (
                <TextField
                  size="small"
                  value={editValues ? editValues.lastName : ''}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  sx={{ mt: 0.5 }}
                />
              ) : (
                <Typography variant="body1" fontWeight={600}>
                  {profile.lastName || '-'}
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box display="flex" flexDirection="column">
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                Date of Birth
              </Typography>
              {isEditing ? (
                <TextField
                  type="date"
                  size="small"
                  value={editValues ? editValues.dateOfBirth : ''}
                  onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                  sx={{ mt: 0.5 }}
                />
              ) : (
                <Typography variant="body1" fontWeight={600}>
                  {profile.dateOfBirth || '-'}
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box display="flex" flexDirection="column">
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                Email Address
              </Typography>
              {isEditing ? (
                <TextField
                  size="small"
                  value={editValues ? editValues.email : ''}
                  disabled
                  sx={{ mt: 0.5 }}
                />
              ) : (
                <Typography variant="body1" fontWeight={600}>
                  {profile.email || '-'}
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box display="flex" flexDirection="column">
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                Phone Number
              </Typography>
              {isEditing ? (
                <TextField
                  type="tel"
                  size="small"
                  value={editValues ? editValues.phone : ''}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  sx={{ mt: 0.5 }}
                />
              ) : (
                <Typography variant="body1" fontWeight={600}>
                  {profile.phone || '-'}
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box display="flex" flexDirection="column">
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                User Role
              </Typography>
              {isEditing ? (
                <TextField
                  size="small"
                  value={editValues ? editValues.role : ''}
                  disabled
                  sx={{ mt: 0.5 }}
                />
              ) : (
                <Typography variant="body1" fontWeight={600}>
                  {profile.role || '-'}
                </Typography>
              )}
            </Box>
          </Grid>
          {(userRole === 'Mentor' || userRole === 'Member') && (
            <Grid item xs={12} md={4}>
              <Box display="flex" flexDirection="column">
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                  Position
                </Typography>
                {isEditing ? (
                  <Select
                    size="small"
                    value={editValues ? editValues.position : ''}
                    onChange={(e) => handleChange('position', e.target.value)}
                    sx={{ mt: 0.5 }}
                    displayEmpty
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
                ) : (
                  <Typography variant="body1" fontWeight={600}>
                    {profile.position || '-'}
                  </Typography>
                )}
              </Box>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Section 3: Address */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 4 }}>
          Address
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Box display="flex" flexDirection="column">
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                Country
              </Typography>
              {isEditing ? (
                <TextField
                  size="small"
                  value={editValues ? editValues.country : ''}
                  onChange={(e) => handleChange('country', e.target.value)}
                  sx={{ mt: 0.5 }}
                />
              ) : (
                <Typography variant="body1" fontWeight={600}>
                  {profile.country || '-'}
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box display="flex" flexDirection="column">
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                City
              </Typography>
              {isEditing ? (
                <TextField
                  size="small"
                  value={editValues ? editValues.city : ''}
                  onChange={(e) => handleChange('city', e.target.value)}
                  sx={{ mt: 0.5 }}
                />
              ) : (
                <Typography variant="body1" fontWeight={600}>
                  {profile.city || '-'}
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box display="flex" flexDirection="column">
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                Postal Code
              </Typography>
              {isEditing ? (
                <TextField
                  size="small"
                  value={editValues ? editValues.postalCode : ''}
                  onChange={(e) => handleChange('postalCode', e.target.value)}
                  sx={{ mt: 0.5 }}
                />
              ) : (
                <Typography variant="body1" fontWeight={600}>
                  {profile.postalCode || '-'}
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
      <Box
        sx={{
          display: 'flex',
          justifyContent: { xs: 'center', md: 'flex-end' },
          mt: 4,
          px: { md: 3 },
        }}
      >
        {isEditing && (
          <Button
            variant="contained"
            fullWidth
            disabled={submitLoading}
            startIcon={submitLoading ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{
              width: { xs: '100%', md: 'auto' },
              backgroundColor: 'primary.dark',
              color: 'common.white',
            }}
            onClick={handleSave}
          >
            {submitLoading ? 'Saving...' : 'Submit'}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default ViewProfile;
