import { useState, ChangeEvent } from 'react';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import IconifyIcon from 'components/base/IconifyIcon';
import TaskOverviewTable from './TaskOverviewTable';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { MemberResponse } from 'api/member/member';

const TaskOverview = () => {
  const [searchText, setSearchText] = useState('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const { data: allTasks } = useSelector((state: RootState) => state.tasks.allTasks);
  const { data: members } = useSelector((state: RootState) => state.members);

  // Transform tasks to include member avatars (same logic as TaskList.tsx)
  const mappedTasks = (allTasks?.tasks || []).map((task) => {
    const memberAvatars = (task.memberId || []).map((id: string) => {
      const member = members?.find((m: MemberResponse) => m._id === id);
      return { id, avatar: member?.avatar || '' };
    });
    return {
      ...task,
      memberId: memberAvatars,
    };
  });

  return (
    <Stack direction="column" spacing={1} width={1}>
      <Stack alignItems="center" justifyContent="space-between">
        <Typography variant="h4" minWidth={200}>
          Task Overview
        </Typography>
        <TextField
          variant="filled"
          size="small"
          placeholder="Search Task"
          value={searchText}
          onChange={handleInputChange}
          sx={{ width: 1, maxWidth: 250 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconifyIcon icon={'mynaui:search'} />
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Paper sx={{ mt: 1.5, p: 0, pb: 0.75, minHeight: 411, width: 1 }}>
        <TaskOverviewTable searchText={searchText} rows={mappedTasks} />
      </Paper>
    </Stack>
  );
};

export default TaskOverview;
