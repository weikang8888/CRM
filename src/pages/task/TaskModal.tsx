import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Avatar from '@mui/material/Avatar';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMentors } from 'store/mentorSlice';
import { fetchMembers } from 'store/memberSlice';
import { RootState, AppDispatch } from 'store';
import FormHelperText from '@mui/material/FormHelperText';

const statusOptions = ['pending', 'in progress', 'completed'];

export interface TaskForm {
  _id?: string;
  photo: File | string;
  title: string;
  progress: number;
  status: string;
  dueDate: string;
  memberId: string[];
  mentorId: string;
}

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (form: TaskForm) => void;
  onEdit?: (form: TaskForm) => void;
  initialValues?: TaskForm | null;
  mode?: 'create' | 'edit';
  loading?: boolean;
  error?: string | null;
}

const initialFormState: TaskForm = {
  photo: '',
  title: '',
  progress: 0,
  status: '',
  dueDate: '',
  memberId: [],
  mentorId: '',
};

const TaskModal: React.FC<TaskModalProps> = ({
  open,
  onClose,
  onCreate,
  onEdit,
  initialValues = null,
  mode = 'create',
  loading = false,
}) => {
  const [form, setForm] = useState<TaskForm>(initialFormState);
  const [errors, setErrors] = useState<{ title?: string; status?: string; dueDate?: string }>({});
  const [submitLoading, setSubmitLoading] = useState(false);

  // Redux for mentors and members
  const dispatch = useDispatch<AppDispatch>();
  const { data: mentors, loading: mentorsLoading } = useSelector(
    (state: RootState) => state.mentors,
  );
  const { data: members, loading: membersLoading } = useSelector(
    (state: RootState) => state.members,
  );

  // Get role and mentorId from localStorage
  const role = localStorage.getItem('role');
  const currentMentorId = localStorage.getItem('_id');

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && initialValues) {
        setForm(initialValues);
      } else if (mode === 'create') {
        setForm(initialFormState);
        // If Mentor, set mentorId to self
        if (role === 'Mentor' && currentMentorId) {
          setForm((prev) => ({ ...prev, mentorId: currentMentorId }));
        }
      }
      setErrors({});

      if (!mentors && !mentorsLoading) {
        dispatch(fetchMentors());
      }

      if (!members && !membersLoading) {
        dispatch(fetchMembers());
      }
    }
  }, [
    open,
    role,
    currentMentorId,
    mode,
    initialValues,
    mentors,
    mentorsLoading,
    members,
    membersLoading,
    dispatch,
  ]);

  // Prepare mentorOptions and memberOptions for Selects
  const mentorOptions = Array.isArray(mentors)
    ? (role === 'Mentor' && currentMentorId
        ? mentors.filter((mentor) => mentor._id === currentMentorId)
        : mentors
      ).map((mentor) => ({
        id: mentor._id,
        firstName: mentor.firstName,
        lastName: mentor.lastName,
        name: `${mentor.firstName} ${mentor.lastName}`,
        title: mentor.position,
        avatar: mentor.avatar,
      }))
    : [];

  const memberOptions = Array.isArray(members)
    ? members.map((member) => ({
        id: member._id,
        firstName: member.firstName,
        lastName: member.lastName,
        name: `${member.firstName} ${member.lastName}`,
        position: member.position,
        avatar: member.avatar,
      }))
    : [];

  const mentorLoading = mentorsLoading;
  const memberLoading = membersLoading;

  // Separate useEffect to handle initialValues changes
  useEffect(() => {
    if (mode === 'edit' && initialValues) {
      setForm(initialValues);
    }
  }, [mode, initialValues]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, photo: e.target.files[0] });
    }
  };

  const handleTextChange =
    (field: keyof TaskForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm({ ...form, [field]: e.target.value });
    };

  const handleSelectChange =
    (field: keyof TaskForm) => (e: SelectChangeEvent<string | string[]>) => {
      setForm({ ...form, [field]: e.target.value });
    };

  // Clear form when modal closes
  const handleCancel = () => {
    setForm(initialFormState);
    setErrors({});
    onClose();
  };

  const handleSubmit = async () => {
    const newErrors: { title?: string; status?: string; dueDate?: string } = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.status.trim()) newErrors.status = 'Status is required';
    if (!form.dueDate.trim()) newErrors.dueDate = 'Due date is required';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitLoading(true);
    try {
      if (mode === 'edit' && onEdit) {
        await onEdit(form);
        setErrors({});
      } else {
        await onCreate(form);
        setErrors({});
      }
    } catch (error) {
      // Error handling is done in the parent component
      console.error('Task submission error:', error);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{mode === 'edit' ? 'Edit Task' : 'Create Task'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1} direction="column">
          {/* Full-width image upload with grey background and centered icon */}
          <Box
            position="relative"
            width={1}
            height={180}
            bgcolor="#f5f5f5"
            borderRadius={2}
            display="flex"
            alignItems="center"
            justifyContent="center"
            overflow="hidden"
            sx={{ cursor: 'pointer' }}
            component="label"
          >
            {form.photo ? (
              typeof form.photo === 'string' ? (
                <Box
                  component="img"
                  src={form.photo}
                  alt="Task"
                  sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    top: 0,
                    left: 0,
                    zIndex: 1,
                  }}
                />
              ) : (
                <Box
                  component="img"
                  src={URL.createObjectURL(form.photo)}
                  alt="Task"
                  sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    top: 0,
                    left: 0,
                    zIndex: 1,
                  }}
                />
              )
            ) : null}
            <IconButton
              color="primary"
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                zIndex: 2,
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper',
                boxShadow: 1,
                '&:hover': { bgcolor: 'grey.100' },
                width: 56,
                height: 56,
              }}
              component="span"
            >
              <PhotoCamera sx={{ fontSize: 32 }} />
            </IconButton>
            <input type="file" hidden onChange={handlePhotoChange} />
          </Box>
          {/* Title field with Typography label */}
          <Stack direction="column" spacing={0.5} width={1}>
            <Typography variant="subtitle2" fontWeight={600}>
              Title
            </Typography>
            <TextField
              value={form.title}
              onChange={handleTextChange('title')}
              fullWidth
              placeholder="Enter task title"
              size="small"
              required
              error={!!errors.title}
              helperText={errors.title}
              disabled={mode === 'edit' && role === 'Member'}
            />
          </Stack>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Stack direction="column" spacing={0.5} flex={1}>
              <Typography variant="subtitle2" fontWeight={600}>
                Status
              </Typography>
              <FormControl fullWidth error={!!errors.status}>
                <Select
                  value={form.status}
                  onChange={handleSelectChange('status')}
                  size="small"
                  required
                  // Status is always editable
                >
                  {statusOptions.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
                {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
              </FormControl>
            </Stack>
            <Stack direction="column" spacing={0.5} flex={1}>
              <Typography variant="subtitle2" fontWeight={600}>
                Due Date
              </Typography>
              <TextField
                type="date"
                value={form.dueDate}
                onChange={handleTextChange('dueDate')}
                fullWidth
                InputLabelProps={{ shrink: true }}
                size="small"
                required
                error={!!errors.dueDate}
                helperText={errors.dueDate}
                disabled={mode === 'edit' && role === 'Member'}
                inputProps={{
                  min: new Date().toISOString().split('T')[0],
                }}
              />
            </Stack>
          </Stack>
          <Stack direction="row" spacing={2} width={1}>
            <Stack direction="column" spacing={0.5} flex={1}>
              <Typography variant="subtitle2" fontWeight={600}>
                Assign To Members
              </Typography>
              <FormControl fullWidth>
                <Select
                  multiple={true}
                  value={form.memberId}
                  onChange={handleSelectChange('memberId')}
                  input={<OutlinedInput />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: '100%' }}>
                      {(selected as string[]).map((id) => {
                        const member = memberOptions.find((u) => u.id === id);
                        return member ? (
                          <Box
                            key={id}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                              bgcolor: 'primary.main',
                              color: 'primary.contrastText',
                              borderRadius: 1,
                              px: 1,
                              py: 0.5,
                              fontSize: '0.75rem',
                              maxWidth: '100%',
                            }}
                          >
                            <Avatar
                              src={member.avatar}
                              sx={{
                                width: 16,
                                height: 16,
                                fontSize: '0.75rem',
                                bgcolor: 'rgba(255,255,255,0.2)',
                              }}
                            />
                            <Typography
                              variant="caption"
                              sx={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: 80,
                              }}
                            >
                              {member.firstName} {member.lastName}
                            </Typography>
                          </Box>
                        ) : null;
                      })}
                    </Box>
                  )}
                  size="small"
                  disabled={mentorLoading || (mode === 'edit' && role === 'Member')}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 120,
                        overflowY: 'auto',
                      },
                    },
                  }}
                >
                  {memberLoading ? (
                    <MenuItem disabled>Loading...</MenuItem>
                  ) : memberOptions.length === 0 ? (
                    <MenuItem disabled>No members found</MenuItem>
                  ) : (
                    memberOptions.map((member) => (
                      <MenuItem key={member.id} value={member.id}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Avatar src={member.avatar} sx={{ width: 24, height: 24 }} />
                          <Typography>
                            {member.firstName} {member.lastName}
                          </Typography>
                        </Stack>
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Stack>
            <Stack direction="column" spacing={0.5} flex={1}>
              <Typography variant="subtitle2" fontWeight={600}>
                Assign To Mentor
              </Typography>
              <FormControl fullWidth>
                <Select
                  multiple={false}
                  value={form.mentorId}
                  onChange={handleSelectChange('mentorId')}
                  input={<OutlinedInput />}
                  renderValue={(selected) => {
                    if (!selected) {
                      return <Typography color="text.secondary">Select mentor</Typography>;
                    }
                    const mentor = mentorOptions.find((u) => u.id === selected);
                    return mentor ? (
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Avatar src={mentor.avatar} sx={{ width: 24, height: 24 }} />
                        <Typography variant="body2">
                          {mentor.firstName} {mentor.lastName}
                        </Typography>
                      </Stack>
                    ) : null;
                  }}
                  size="small"
                  disabled={
                    mentorLoading || role === 'Mentor' || (mode === 'edit' && role === 'Member')
                  }
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 120,
                        overflowY: 'auto',
                      },
                    },
                  }}
                >
                  {mentorLoading ? (
                    <MenuItem disabled>Loading...</MenuItem>
                  ) : mentorOptions.length === 0 ? (
                    <MenuItem disabled>No mentors found</MenuItem>
                  ) : (
                    [
                      <MenuItem key="none" value="">
                        <Typography color="text.secondary">None</Typography>
                      </MenuItem>,
                      ...mentorOptions.map((mentor) => (
                        <MenuItem key={mentor.id} value={mentor.id}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Avatar src={mentor.avatar} sx={{ width: 24, height: 24 }} />
                            <Typography>
                              {mentor.firstName} {mentor.lastName}
                            </Typography>
                          </Stack>
                        </MenuItem>
                      )),
                    ]
                  )}
                </Select>
              </FormControl>
            </Stack>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} disabled={loading || submitLoading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || submitLoading}
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

export default TaskModal;
