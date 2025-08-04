import { useState, useEffect, ChangeEvent } from 'react';
import {
  createMember,
  MemberPayload,
  MemberResponse,
  editMember,
  deleteMember,
} from '../../api/member/member';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { InputAdornment, Avatar, Button, CircularProgress, Box } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import DataGridFooter from 'components/common/DataGridFooter';
import ActionMenu from 'components/sections/dashboard/task-overview/ActionMenu';
import MemberModal from './MemberModal';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import ConfirmationModal from 'components/modal/ConfirmationModal';
import { uploadPhoto } from 'api/upload/upload';
import GeneratedPasswordModal from 'components/modal/GeneratedPasswordModal';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import { fetchMembers } from 'store/memberSlice';
import NoRowsOverlay from 'components/common/NoRowsOverlay';

const MemberList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editingMember, setEditingMember] = useState<MemberResponse | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<MemberResponse | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { data: members, loading: membersLoading } = useSelector(
    (state: RootState) => state.members,
  );

  useEffect(() => {
    if (!members && !membersLoading) dispatch(fetchMembers());
  }, [members, membersLoading]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const filteredMembers = Array.isArray(members)
    ? members.filter((member) => {
        const search = searchText.toLowerCase();
        const email = (member.email || '').toLowerCase();
        const firstName = (member.firstName || '').toLowerCase();
        const lastName = (member.lastName || '').toLowerCase();
        return (
          firstName.includes(search) ||
          lastName.includes(search) ||
          (member.position || '').toLowerCase().includes(search) ||
          email.includes(search)
        );
      })
    : [];

  const handleCreateMember = async (data: MemberPayload) => {
    try {
      const response = await createMember({ ...data, avatar: undefined });
      if (data.avatar && data.avatar instanceof File) {
        await uploadPhoto({
          type: 'member',
          refId: response.memberId,
          photo: data.avatar,
        });
      }
      toast.success('Mentor created successfully!');
      setGeneratedPassword(response.generatedPassword);
      setShowPasswordModal(true);
      setOpen(false);
      dispatch(fetchMembers());
    } catch (error: unknown) {
      toast.error((error as { message?: string })?.message || 'Failed to create mentor');
      setOpen(true);
    }
  };

  const handleEditMember = (member: MemberResponse) => {
    setEditingMember(member);
    setEditMode(true);
    setOpen(true);
  };

  const handleEditSubmit = async (data: MemberPayload) => {
    if (!editingMember) return;
    try {
      // If avatar is a File, upload it first
      if (data.avatar && data.avatar instanceof File) {
        await uploadPhoto({
          type: 'member',
          refId: editingMember._id, // Editing, so use member ID
          photo: data.avatar,
        });
      }
      // Prepare payload without avatar and email
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { avatar, email, ...payload } = data;
      await editMember(editingMember._id, payload);
      toast.success('Member updated successfully!');
      setOpen(false);
      setEditMode(false);
      setEditingMember(null);
      dispatch(fetchMembers());
    } catch (error: unknown) {
      toast.error((error as { message?: string })?.message || 'Failed to update member');
    }
  };

  const handleRemoveMember = (member: MemberResponse) => {
    setMemberToDelete(member);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!memberToDelete) return;
    try {
      setDeleteLoading(true);
      await deleteMember(memberToDelete._id);
      toast.success('Member deleted successfully!');
      dispatch(fetchMembers());
    } catch (error: unknown) {
      toast.error((error as { message?: string })?.message || 'Failed to delete member');
    } finally {
      setConfirmOpen(false);
      setMemberToDelete(null);
      setDeleteLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setMemberToDelete(null);
  };

  const role = typeof window !== 'undefined' ? localStorage.getItem('role') : undefined;
  const isMentor = role === 'Mentor';

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
      field: 'position',
      headerName: 'Position',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (params.value ? String(params.value) : '-'),
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      minWidth: 140,
      renderCell: (params) => (params.value ? String(params.value) : '-'),
    },
    {
      field: 'phone',
      headerName: 'Phone',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (params.value ? String(params.value) : '-'),
    },
    {
      field: 'createdAt',
      headerName: 'Join Date',
      flex: 1,
      minWidth: 120,
      renderCell: (params) =>
        params.value ? dayjs(String(params.value)).format('YYYY-MM-DD') : '-',
    },
    {
      field: 'task',
      headerName: 'Tasks',
      type: 'number',
      flex: 1,
      minWidth: 80,
    },
    // Only show action column if user is not a Mentor
    ...(isMentor ? [] : [{
      field: 'action',
      headerName: 'Action',
      headerAlign: 'right' as const,
      align: 'right' as const,
      editable: false,
      sortable: false,
      flex: 1,
      minWidth: 100,
      renderCell: (params: GridRenderCellParams) => (
        <ActionMenu
          onEdit={() => handleEditMember(params.row)}
          onRemove={() => handleRemoveMember(params.row)}
        />
      ),
    }]),
  ];

  return (
    <Stack spacing={3} width={1} direction="column" p={3.5}>
      <Stack alignItems="center" justifyContent="space-between">
        <Typography variant="h4" fontWeight={700}>
          Member List
        </Typography>
        {role !== 'Mentor' && role !== 'Member' && (
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
            Create Member
          </Button>
        )}
      </Stack>{' '}
      <TextField
        variant="filled"
        size="small"
        placeholder="Search Member"
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
        columns={columns}
        rows={filteredMembers}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        density="standard"
        disableColumnResize
        disableColumnMenu
        disableColumnSelector
        disableRowSelectionOnClick
        autosizeOptions={{
          includeOutliers: true,
          includeHeaders: false,
          outliersFactor: 1,
          expand: true,
        }}
        slots={{
          pagination: DataGridFooter,
          noRowsOverlay: () => <NoRowsOverlay message="No any member" />,
          loadingOverlay: () => (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              height="200px"
              width="100%"
            >
              <CircularProgress />
            </Box>
          ),
        }}
        pageSizeOptions={[5, 10, 20]}
        getRowId={(row) => row._id || row.id}
        loading={membersLoading}
      />
      <MemberModal
        open={open}
        onClose={() => {
          setOpen(false);
          setEditMode(false);
          setEditingMember(null);
        }}
        onSubmit={editMode ? handleEditSubmit : handleCreateMember}
        initialValues={
          editMode && editingMember
            ? {
                firstName: editingMember.firstName,
                lastName: editingMember.lastName,
                email: editingMember.email,
                position: editingMember.position,
                avatar: editingMember.avatar,
              }
            : undefined
        }
        mode={editMode ? 'edit' : 'create'}
      />
      <GeneratedPasswordModal
        open={showPasswordModal}
        password={generatedPassword}
        onClose={() => setShowPasswordModal(false)}
      />
      <ConfirmationModal
        open={confirmOpen}
        title="Delete Member"
        description="Are you sure you want to delete this member? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        loading={deleteLoading}
      />
    </Stack>
  );
};

export default MemberList;
