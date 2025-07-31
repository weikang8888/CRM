import { useState, ChangeEvent, useEffect } from 'react';
import TaskOverviewTable from '../../components/sections/dashboard/task-overview/TaskOverviewTable';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import IconifyIcon from 'components/base/IconifyIcon';
import TaskModal, { TaskForm } from './TaskModal';
import {
  createTask,
  editTask,
  deleteTask,
  TaskPayload,
  updateTaskStatusProgress,
  memberTask,
} from 'api/task/task';

// Define Task type based on TaskListResponse
type Task = {
  _id: string;
  title: string;
  progress: number;
  status: string;
  dueDate: string;
  photo?: string;
  memberId?: (string | number | { id: string | number; avatar?: string })[];
  mentorId?: string;
};
import { getMembersList } from 'api/member/member';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmationModal from 'components/modal/ConfirmationModal';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from 'store';
import { fetchAllTasks, fetchMyTasks } from 'store/taskSlice';
import { uploadPhoto } from 'api/upload/upload';

const TaskList = () => {
  const [searchText, setSearchText] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [members, setMembers] = useState<
    Array<{
      _id: string;
      firstName: string;
      lastName: string;
      position: string;
      avatar?: string;
      email: string;
      phone: string;
      joinDate: string;
    }>
  >([]);
  const [editMode, setEditMode] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskForm | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  // Use Redux for tasks
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: allTasks,
    loading: allLoading,
    error: allError,
  } = useSelector((state: RootState) => state.tasks.allTasks);
  const {
    data: myTasks,
    loading: myLoading,
    error: myError,
  } = useSelector((state: RootState) => state.tasks.myTasks);

  // Helper to refetch tasks with correct params for Mentor or Member
  const refetchTasks = () => {
    const role = localStorage.getItem('role');
    const mentorId = localStorage.getItem('_id');
    const memberId = localStorage.getItem('_id');
    if (role === 'Mentor' && mentorId) {
      dispatch(fetchMyTasks({ mentorId }));
    } else if (role === 'Member' && memberId) {
      dispatch(fetchMyTasks({ memberId }));
    } else {
      dispatch(fetchAllTasks());
    }
  };

  useEffect(() => {
    const role = localStorage.getItem('role');
    const id = localStorage.getItem('_id');
    if (role === 'Mentor' && id) {
      if (!myTasks && !myLoading) dispatch(fetchMyTasks({ mentorId: id }));
    } else if (role === 'Member' && id) {
      if (!myTasks && !myLoading) dispatch(fetchMyTasks({ memberId: id }));
    } else {
      if (!allTasks && !allLoading) dispatch(fetchAllTasks());
    }
  }, [dispatch, allTasks, allLoading, myTasks, myLoading]);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const data = await getMembersList();
      if (Array.isArray(data)) {
        setMembers(data);
      } else if (
        data &&
        typeof data === 'object' &&
        'members' in data &&
        Array.isArray((data as { members: unknown[] }).members)
      ) {
        setMembers(
          (
            data as {
              members: Array<{
                _id: string;
                firstName: string;
                lastName: string;
                position: string;
                avatar?: string;
                email: string;
                phone: string;
                joinDate: string;
              }>;
            }
          ).members,
        );
      } else {
        setMembers([]);
      }
    } catch (error) {
      console.error('Failed to fetch members:', error);
      setMembers([]);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleOpen = () => setOpen(true);

  const handleCreateTask = async (form: TaskForm) => {
    setLoading(true);
    setError(null);
    try {
      const payload: TaskPayload = {
        title: form.title,
        progress: form.progress,
        status: form.status,
        dueDate: form.dueDate,
        memberId: form.memberId,
        mentorId: form.mentorId,
      };

      const response = await createTask(payload);

      if (form.photo && form.photo instanceof File) {
        await uploadPhoto({
          type: 'task',
          refId: response._id,
          photo: form.photo,
        });
      }

      setLoading(false);
      setOpen(false);
      toast.success('Task created successfully!');
      refetchTasks();
    } catch (error: unknown) {
      const errorMessage = (error as { message?: string })?.message || 'Failed to create task';
      setLoading(false);
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleEditTask = (task: Task) => {
    // Convert task data to the format expected by TaskModal
    const editingTaskData: TaskForm = {
      _id: task._id,
      photo: task.photo || '',
      title: task.title,
      progress: task.progress,
      status: task.status,
      dueDate: task.dueDate,
      memberId: Array.isArray(task.memberId)
        ? task.memberId
            .map((member) => {
              // Handle both string/number IDs and object format from mappedTasks
              if (typeof member === 'object' && member !== null && 'id' in member) {
                return String(member.id);
              }
              return String(member);
            })
            .filter(Boolean)
        : [],
      mentorId: task.mentorId || '',
    };

    setEditingTask(editingTaskData);
    setEditMode(true);
    setOpen(true);
  };

  const handleEditSubmit = async (form: TaskPayload) => {
    setLoading(true);
    setError(null);
    try {
      await editTask(form);

      if (form.photo && form.photo instanceof File) {
        await uploadPhoto({
          type: 'task',
          refId: form._id || '',
          photo: form.photo,
        });
      }

      setLoading(false);
      setOpen(false);
      setEditMode(false);
      setEditingTask(null);
      toast.success('Task updated successfully!');
      refetchTasks();
    } catch (error: unknown) {
      const errorMessage = (error as { message?: string })?.message || 'Failed to update task';
      setLoading(false);
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleUpdateTaskStatus = async (form: TaskForm) => {
    setLoading(true);
    setError(null);
    try {
      // Only update status and progress for the current member
      const memberId = localStorage.getItem('_id') || '';
      const taskId = form._id || (editingTask && editingTask._id) || '';
      await updateTaskStatusProgress({
        taskId,
        memberId,
        status: form.status,
      });
      setLoading(false);
      setOpen(false);
      setEditMode(false);
      setEditingTask(null);
      toast.success('Task status updated successfully!');
      refetchTasks();
    } catch (error: unknown) {
      const errorMessage =
        (error as { message?: string })?.message || 'Failed to update task status';
      setLoading(false);
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleRemoveTask = (task: Task) => {
    setTaskToDelete(task);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    try {
      await deleteTask(taskToDelete._id);
      toast.success('Task deleted successfully!');
      refetchTasks();
    } catch (error: unknown) {
      const errorMessage = (error as { message?: string })?.message || 'Failed to delete task';
      toast.error(errorMessage);
    } finally {
      setConfirmOpen(false);
      setTaskToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setTaskToDelete(null);
  };

  const handleEditMemberTask = async () => {
    setLoading(true);
    setError(null);
    try {
      const memberId = localStorage.getItem('_id') || '';
      const data = await memberTask({ memberId });
      if (Array.isArray(data) && data.length > 0) {
        const t = data[0];
        setEditingTask({
          _id: t.taskId,
          title: t.title,
          dueDate: t.dueDate,
          status: t.memberStatus || t.status,
          progress: t.memberProgress || 0,
          photo: '',
          memberId: [memberId],
          mentorId: '',
        });
        setEditMode(true);
        setOpen(true);
      } else {
        toast.error('No tasks found for this member.');
      }
      setLoading(false);
    } catch (error: unknown) {
      const errorMessage =
        (error as { message?: string })?.message || 'Failed to fetch member tasks';
      setLoading(false);
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const initialState = {
    pagination: { paginationModel: { pageSize: 10 } },
  };

  // Choose which data to show
  const role = localStorage.getItem('role');
  let tasksToShow = [];
  const isMentorOrMember = role === 'Mentor' || role === 'Member';
  tasksToShow = isMentorOrMember ? myTasks?.tasks || [] : allTasks?.tasks || [];
  if (isMentorOrMember ? myLoading : allLoading) return <div>Loading...</div>;
  const errorToShow = isMentorOrMember ? myError : allError;
  if (errorToShow) return <div>Error: {errorToShow.message || 'Failed to load tasks'}</div>;

  // Use tasks from Redux
  const mappedTasks = (tasksToShow as Task[]).map((task) => {
    const memberAvatars = (task.memberId || []).map((id) => {
      // Handle different types of memberId
      const memberId = typeof id === 'object' && id !== null && 'id' in id ? id.id : id;
      const member = members.find((m) => m._id === String(memberId));
      return { id: memberId, avatar: member?.avatar || '' };
    });
    return {
      ...task,
      memberId: memberAvatars,
    };
  });

  return (
    <Stack spacing={3} width={1} direction="column" p={3.5}>
      <Stack alignItems="center" justifyContent="space-between">
        <Typography variant="h4" fontWeight={700}>
          Task List
        </Typography>
        {localStorage.getItem('role') !== 'Member' && (
          <Button
            variant="contained"
            fullWidth
            sx={{
              width: 'auto',
              backgroundColor: 'primary.dark',
              color: 'common.white',
            }}
            onClick={handleOpen}
          >
            Create Task
          </Button>
        )}
      </Stack>
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
      <TaskOverviewTable
        searchText={searchText}
        initialState={initialState}
        rows={mappedTasks}
        onEdit={role === 'Member' ? handleEditMemberTask : handleEditTask}
        onRemove={handleRemoveTask}
      />
      <ConfirmationModal
        open={confirmOpen}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
      <TaskModal
        open={open}
        onClose={() => {
          setOpen(false);
          setEditMode(false);
          setEditingTask(null);
        }}
        onCreate={handleCreateTask}
        onEdit={role === 'Member' ? handleUpdateTaskStatus : handleEditSubmit}
        initialValues={editingTask}
        mode={editMode ? 'edit' : 'create'}
        loading={loading}
        error={error}
      />
    </Stack>
  );
};

export default TaskList;
