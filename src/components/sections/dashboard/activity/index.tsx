import { useMemo, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import IconifyIcon from 'components/base/IconifyIcon';
import ActivityChart from './ActivityChart';
import { RootState } from 'store';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

type TaskType = {
  _id: string;
  title: string;
  progress: number;
  status: string;
  dueDate: string;
  photo?: string;
  createdAt?: string;
};

const Activity = () => {
  const { data: allTasks } = useSelector((state: RootState) => state.tasks.allTasks);

  const chartData = useMemo(() => {
    const tasks: TaskType[] = allTasks?.tasks || [];
    const now = dayjs();
    const startOfThisWeek = now.startOf('week');
    const startOfLastWeek = startOfThisWeek.subtract(1, 'week');
    const startOfTwoWeeksAgo = startOfThisWeek.subtract(2, 'week');

    const thisWeek = tasks.filter(
      (task) => task.createdAt && dayjs(task.createdAt).isSame(startOfThisWeek, 'week'),
    );
    const lastWeek = tasks.filter(
      (task) => task.createdAt && dayjs(task.createdAt).isSame(startOfLastWeek, 'week'),
    );
    const twoWeeksAgo = tasks.filter(
      (task) => task.createdAt && dayjs(task.createdAt).isSame(startOfTwoWeeksAgo, 'week'),
    );

    const thisWeekDaily = Array(7).fill(0);
    thisWeek.forEach((task) => {
      if (task.createdAt) {
        const day = dayjs(task.createdAt).day();
        thisWeekDaily[day]++;
      }
    });

    const lastWeekDaily = Array(7).fill(0);
    lastWeek.forEach((task) => {
      if (task.createdAt) {
        const day = dayjs(task.createdAt).day();
        lastWeekDaily[day]++;
      }
    });

    const twoWeeksAgoDaily = Array(7).fill(0);
    twoWeeksAgo.forEach((task) => {
      if (task.createdAt) {
        const day = dayjs(task.createdAt).day();
        twoWeeksAgoDaily[day]++;
      }
    });

    return {
      thisWeek: thisWeekDaily,
      lastWeek: lastWeekDaily,
      twoWeeksAgo: twoWeeksAgoDaily,
    };
  }, [allTasks]);

  const [data, setData] = useState(chartData.thisWeek);
  const [week, setWeek] = useState('this-week');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (week === 'this-week') {
      setData(chartData.thisWeek);
    } else if (week === 'last-week') {
      setData(chartData.lastWeek);
    } else {
      setData(chartData.twoWeeksAgo);
    }
  }, [chartData, week]);

  const handleSelectChange = (event: SelectChangeEvent) => {
    setWeek(event.target.value);
  };

  return (
    <Paper sx={{ flex: 1, bgcolor: 'info.main' }}>
      <Stack alignItems="center" justifyContent="space-between" mt={-0.5}>
        <Typography variant="body1" color="text.primary" fontWeight={700}>
          Activity
        </Typography>

        <FormControl
          variant="filled"
          sx={{
            width: 100,
            '& .MuiInputBase-root': {
              '&:focus-within': {
                borderColor: 'transparent !important',
                boxShadow: 'none',
              },
            },
          }}
        >
          <Select
            id="select-filled"
            value={week}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            onChange={handleSelectChange}
            IconComponent={() => (
              <IconifyIcon
                icon="iconamoon:arrow-down-2-duotone"
                sx={{
                  transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              />
            )}
          >
            <MenuItem value="this-week">This Week</MenuItem>
            <MenuItem value="last-week">Last Week</MenuItem>
            <MenuItem value="two-weeks-ago">Two Weeks Ago</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Box mt={2} bgcolor="info.lighter" borderRadius={3}>
        <ActivityChart data={data} sx={{ height: '130px !important' }} />
      </Box>
    </Paper>
  );
};

export default Activity;
