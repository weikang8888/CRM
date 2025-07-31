import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import Avatar from '@mui/material/Avatar';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import AvatarGroup from '@mui/material/AvatarGroup';
import IconifyIcon from 'components/base/IconifyIcon';
import { RootState } from 'store';
import { useSelector } from 'react-redux';
import { Key } from 'react';
import dayjs from 'dayjs';

interface TaskCardProps {
  data: {
    memberId: string | string[];
    title: string;
    progress: number;
    status: string;
    dueDate: string;
    photo?: string;
  };
}

const TaskCard = ({ data }: TaskCardProps) => {
  const { data: members } = useSelector((state: RootState) => state.members);

  const membersArray = Array.isArray(members) ? members : [];
  const memberIds = Array.isArray(data.memberId) ? data.memberId : [data.memberId];

  const avatars = membersArray
    .filter((member) => memberIds.includes(member._id))
    .map((member) => member.avatar || '');

  let dueLabel = '';
  if (data.dueDate) {
    const due = dayjs(data.dueDate).startOf('day');
    const now = dayjs().startOf('day');
    const diff = due.diff(now, 'day');
    if (diff < 0) dueLabel = 'Overdue';
    else if (diff === 0) dueLabel = 'Today';
    else dueLabel = `${diff} Day${diff > 1 ? 's' : ''}`;
  }

  return (
    <Card sx={{ userSelect: 'none' }}>
      {data.photo ? (
        <CardMedia component="img" height="110" image={data.photo} alt="task_today_image" />
      ) : (
        <Box height={110} bgcolor="#f5f5f5" borderRadius={2} />
      )}
      <CardContent>
        <Box mt={1.5}>
          <Typography variant="subtitle1" color="text.primary" fontWeight={600}>
            {data.title}
          </Typography>
          {/* <Typography variant="subtitle2" color="text.secondary">
            {data.category}
          </Typography> */}
        </Box>

        <Box mt={1.5}>
          <Stack justifyContent="space-between">
            <Typography variant="body1" color="text.primary" fontWeight={500}>
              Progress
            </Typography>
            <Typography variant="body1" color="primary.main" fontWeight={500}>
              {data.progress}%
            </Typography>
          </Stack>
          <Slider
            defaultValue={data.progress}
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
              {dueLabel}
            </Typography>
          </Stack>

          {/* <AvatarGroup max={5}>
            {data?.photo?.map((photo) => (
              <Avatar key={photo} alt="avatar_img" src={photo} />
            ))}
          </AvatarGroup> */}
          <AvatarGroup max={5}>
            {avatars.map((avatar: string | undefined, idx: Key | null | undefined) => (
              <Avatar key={idx} alt="avatar_img" src={avatar} />
            ))}
          </AvatarGroup>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
