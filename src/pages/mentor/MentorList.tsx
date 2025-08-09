import { useState, useEffect, ChangeEvent } from 'react';
import {
  createMentor,
  MentorPayload,
  MentorResponse,
  editMentor,
  deleteMentor,
} from '../../api/mentor/mentor';
import { uploadPhoto } from 'api/upload/upload';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import IconifyIcon from 'components/base/IconifyIcon';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import DataGridFooter from 'components/common/DataGridFooter';
import ActionMenu from 'components/sections/dashboard/task-overview/ActionMenu';
import MentorModal from './MentorModal';
import { toast } from 'react-toastify';
import ConfirmationModal from 'components/modal/ConfirmationModal';
import GeneratedPasswordModal from 'components/modal/GeneratedPasswordModal';
import { fetchMentors } from 'store/mentorSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import NoRowsOverlay from 'components/common/NoRowsOverlay';

const MentorList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editingMentor, setEditingMentor] = useState<MentorResponse | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [mentorToDelete, setMentorToDelete] = useState<MentorResponse | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const columns: GridColDef[] = [
    {
      field: 'avatar',
      headerName: 'Avatar',
      flex: 1,
      minWidth: 100,
      sortable: false,
      renderCell: (params) => (
        <Stack height="100%" width="100%" alignItems="center">
          <Avatar src={params.value} alt="avatar" sx={{ width: 40, height: 40 }} />
        </Stack>
      ),
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <span>
          {params.row.firstName} {params.row.lastName}
        </span>
      ),
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'position',
      headerName: 'Position',
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'task',
      headerName: 'Tasks',
      type: 'number',
      flex: 1,
      minWidth: 80,
    },
    {
      field: 'action',
      headerName: 'Action',
      headerAlign: 'right',
      align: 'right',
      editable: false,
      sortable: false,
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <ActionMenu
          onEdit={() => handleEditMentor(params.row)}
          onRemove={() => handleRemoveMentor(params.row)}
        />
      ),
    },
    // {
    //   field: 'followed',
    //   headerName: 'Followed',
    //   width: 150,
    //   renderCell: (params) =>
    //     params.value ? (
    //       <Chip label="Followed" color="success" size="small" />
    //     ) : (
    //       <Chip label="Follow" color="primary" size="small" />
    //     ),
    // },
  ];

  const { data: mentors, loading: mentorsLoading } = useSelector(
    (state: RootState) => state.mentors,
  );

  useEffect(() => {
    if (!mentors && !mentorsLoading) dispatch(fetchMentors());
  }, [mentors, mentorsLoading]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const filteredMentors = Array.isArray(mentors)
    ? mentors.filter((mentor) => {
        const search = searchText.toLowerCase();
        const email = (mentor.email || '').toLowerCase();
        const firstName = (mentor.firstName || '').toLowerCase();
        const lastName = (mentor.lastName || '').toLowerCase();
        return (
          firstName.includes(search) ||
          lastName.includes(search) ||
          (mentor.position || '').toLowerCase().includes(search) ||
          email.includes(search)
        );
      })
    : [];

  const handleCreateMentor = async (data: MentorPayload) => {
    try {
      const response = await createMentor({ ...data, avatar: undefined });
      if (data.avatar && data.avatar instanceof File) {
        await uploadPhoto({
          type: 'mentor',
          refId: response.mentorId,
          photo: data.avatar,
        });
      }
      toast.success('Mentor created successfully!');
      setGeneratedPassword(response.generatedPassword);
      setShowPasswordModal(true);
      setOpen(false);
      dispatch(fetchMentors());
    } catch (error: unknown) {
      toast.error((error as { message?: string })?.message || 'Failed to create mentor');
      setOpen(true);
    }
  };

  const handleEditMentor = (mentor: MentorResponse) => {
    setEditingMentor(mentor);
    setEditMode(true);
    setOpen(true);
  };

  const handleEditSubmit = async (data: MentorPayload) => {
    if (!editingMentor) return;
    try {
      // If avatar is a File, upload it first
      if (data.avatar && data.avatar instanceof File) {
        await uploadPhoto({
          type: 'mentor',
          refId: editingMentor._id, // Editing, so use mentor ID
          photo: data.avatar,
        });
      }
      // Prepare payload without avatar and email
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { avatar, email, ...payload } = data;
      await editMentor(editingMentor._id, payload);
      toast.success('Mentor updated successfully!');
      setOpen(false);
      setEditMode(false);
      setEditingMentor(null);
      dispatch(fetchMentors());
    } catch (error: unknown) {
      toast.error((error as { message?: string })?.message || 'Failed to update mentor');
    }
  };

  const handleRemoveMentor = (mentor: MentorResponse) => {
    setMentorToDelete(mentor);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!mentorToDelete) return;
    try {
      setDeleteLoading(true);
      await deleteMentor(mentorToDelete._id);
      toast.success('Mentor deleted successfully!');
      dispatch(fetchMentors());
    } catch (error: unknown) {
      toast.error((error as { message?: string })?.message || 'Failed to delete mentor');
    } finally {
      setConfirmOpen(false);
      setMentorToDelete(null);
      setDeleteLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setMentorToDelete(null);
  };

  const mentorsWithId = filteredMentors.map((mentor: MentorResponse) => ({
    ...mentor,
    id: mentor._id,
  }));

  return (
    <Stack spacing={3} width={1} direction="column" p={3.5}>
      <Stack alignItems="center" justifyContent="space-between">
        <Typography variant="h4" fontWeight={700}>
          Mentor List
        </Typography>
        <Button
          variant="contained"
          fullWidth
          sx={{
            width: 'auto',
            backgroundColor: 'primary.dark',
            color: 'common.white',
          }}
          onClick={() => {
            setOpen(true);
          }}
        >
          Create Mentor
        </Button>
      </Stack>{' '}
      <TextField
        variant="filled"
        size="small"
        placeholder="Search Task"
        value={searchText}
        onChange={handleInputChange}
        sx={{ width: 1, maxWidth: 450 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconifyIcon icon={'mynaui:search'} />
            </InputAdornment>
          ),
        }}
      />
      <DataGrid
        autoHeight
        density="standard"
        disableColumnResize
        disableColumnMenu
        disableColumnSelector
        disableRowSelectionOnClick
        columns={columns}
        rows={mentorsWithId}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        autosizeOptions={{
          includeOutliers: true,
          includeHeaders: false,
          outliersFactor: 1,
          expand: true,
        }}
        slots={{
          pagination: DataGridFooter,
          noRowsOverlay: () => <NoRowsOverlay message="No any mentor" />,
          loadingOverlay: () => (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              height="400px"
              width="100%"
            >
              <CircularProgress />
            </Box>
          ),
        }}
        pageSizeOptions={[5, 10, 20]}
        getRowId={(row) => row.id}
        loading={mentorsLoading}
      />
      <MentorModal
        open={open}
        onClose={() => {
          setOpen(false);
          setEditMode(false);
          setEditingMentor(null);
        }}
        onSubmit={(data) => {
          const payload = { ...data, avatar: data.avatar === null ? undefined : data.avatar };
          return editMode ? handleEditSubmit(payload) : handleCreateMentor(payload);
        }}
        initialValues={editMode && editingMentor ? editingMentor : undefined}
        mode={editMode ? 'edit' : 'create'}
      />
      <GeneratedPasswordModal
        open={showPasswordModal}
        password={generatedPassword}
        onClose={() => setShowPasswordModal(false)}
      />
      <ConfirmationModal
        open={confirmOpen}
        title="Delete Mentor"
        description="Are you sure you want to delete this mentor? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        loading={deleteLoading}
      />
    </Stack>
  );
};

export default MentorList;
