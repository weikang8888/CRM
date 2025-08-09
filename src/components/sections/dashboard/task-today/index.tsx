import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import Divider from '@mui/material/Divider';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import AvatarGroup from '@mui/material/AvatarGroup';
import IconifyIcon from 'components/base/IconifyIcon';
import { RootState } from 'store';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import dayjs from 'dayjs';

const TaskToday = () => {
  const { data: allTasks } = useSelector((state: RootState) => state.tasks.allTasks);

  const { data: members } = useSelector((state: RootState) => state.members);

  const membersArray = Array.isArray(members) ? members : [];

  // Find the task with the due date closest to today
  const closestTask = useMemo(() => {
    if (!allTasks?.tasks || allTasks.tasks.length === 0) return null;
    const today = new Date();
    const tasksWithDueDate = allTasks.tasks.filter((task) => !!task.dueDate);
    if (tasksWithDueDate.length === 0) return null;
    return tasksWithDueDate.reduce((closest, current) => {
      const currentDiff = Math.abs(new Date(current.dueDate).getTime() - today.getTime());
      const closestDiff = Math.abs(new Date(closest.dueDate).getTime() - today.getTime());
      return currentDiff < closestDiff ? current : closest;
    }, tasksWithDueDate[0]);
  }, [allTasks]);

  // Get memberIds and avatars for closestTask
  let memberIds: string[] = [];
  function hasMemberId(task: unknown): task is { memberId: string[] | string } {
    return !!task && typeof task === 'object' && 'memberId' in task;
  }
  if (hasMemberId(closestTask)) {
    const ids = closestTask.memberId;
    if (Array.isArray(ids)) {
      memberIds = ids.filter((id): id is string => typeof id === 'string');
    } else if (typeof ids === 'string') {
      memberIds = [ids];
    }
  }

  const avatars = membersArray
    .filter((member) => memberIds.includes(member._id))
    .map((member) => member.avatar || '');

  const dueLabel = useMemo(() => {
    if (!closestTask?.dueDate) return '';
    const due = dayjs(closestTask.dueDate).startOf('day');
    const now = dayjs().startOf('day');
    const diff = due.diff(now, 'day');
    if (diff < 0) return 'Overdue';
    if (diff === 0) return 'Today';
    return `${diff} Day${diff > 1 ? 's' : ''}`;
  }, [closestTask]);

  return (
    <Card sx={{ width: 1 }}>
      <CardHeader
        action={
          <IconButton aria-label="settings">
            <IconifyIcon
              icon="lets-icons:meatballs-menu"
              color="primary.dark"
              fontSize="h4.fontSize"
            />
          </IconButton>
        }
        title="Task Today"
      />
      {closestTask?.photo ? (
        <CardMedia component="img" height={160} image={closestTask?.photo} alt="task_today_image" />
      ) : (
        <Box height={160} bgcolor="#f5f5f5" borderRadius={2} />
      )}
      <CardContent>
        <Box mt={2}>
          <Typography variant="subtitle1" color="text.primary" fontWeight={600}>
            {closestTask ? closestTask.title : 'No task for today'}
          </Typography>
        </Box>

        <Box mt={2}>
          <Stack justifyContent="space-between">
            <Typography variant="body1" color="text.primary" fontWeight={500}>
              Progress
            </Typography>
            <Typography variant="body1" color="primary.main" fontWeight={500}>
              {closestTask ? `${closestTask.progress || 0}%` : ''}
            </Typography>
          </Stack>
          <Slider
            defaultValue={closestTask ? closestTask.progress || 0 : 0}
            color="primary"
            aria-label="Default"
            valueLabelDisplay="auto"
            disabled
          />
        </Box>

        <Stack mt={2} alignItems="center" justifyContent="space-between">
          <Stack alignItems="center" spacing={1}>
            <IconifyIcon icon="mynaui:clock-circle" color="text.secondary" fontSize="h4.fontSize" />
            <Typography variant="body1" fontWeight={500}>
              {closestTask ? dueLabel : ''}
            </Typography>
          </Stack>

          <AvatarGroup max={5}>
            {avatars.map((avatar: string | undefined, idx: number) => (
              <Avatar key={idx} alt="avatar_img" src={avatar} />
            ))}
          </AvatarGroup>
        </Stack>

        <Divider />

        <Stack alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1" color="primary.dark" fontWeight={700}>
            Detail Task
          </Typography>
        </Stack>

        <Stack direction="column" spacing={2} mt={2}>
          {/* {taskDetails.map((task) => (
            <Stack key={task.id} alignItems="center" spacing={1.5}>
              <Stack
                alignItems="center"
                justifyContent="center"
                height={36}
                width={36}
                borderRadius={2.5}
                bgcolor="info.main"
              >
                <Typography variant="body2" fontWeight={500}>
                  {task.id}
                </Typography>
              </Stack>
              <Typography variant="body2" fontWeight={500}>
                {task.details}
              </Typography>
            </Stack>
          ))} */}
          <Typography variant="body2" fontWeight={500}>
            Coming Soon
          </Typography>
        </Stack>
      </CardContent>

      <CardActions disableSpacing sx={{ mt: 7 }}>
        <Button variant="contained" color="primary" size="medium" fullWidth>
          Go To Detail
        </Button>
      </CardActions>
    </Card>
  );
};

export default TaskToday;
