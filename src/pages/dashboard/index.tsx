import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Footer from 'components/common/Footer';
import ChangePasswordModal from 'components/modal/ChangePasswordModal';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, Suspense, lazy } from 'react';
import { Skeleton } from '@mui/material';
import { fetchMentors } from 'store/mentorSlice';
import { AppDispatch, RootState } from 'store';
import { fetchAllTasks } from 'store/taskSlice';
import { fetchMembers } from 'store/memberSlice';

// Lazy load dashboard components
const Activity = lazy(() => import('components/sections/dashboard/activity'));
const TaskToday = lazy(() => import('components/sections/dashboard/task-today'));
const RunningTask = lazy(() => import('components/sections/dashboard/running-task'));
const UpcomingTask = lazy(() => import('components/sections/dashboard/upcoming-task'));
const WeekCalendar = lazy(() => import('components/sections/dashboard/week-calendar'));
const TaskOverview = lazy(() => import('components/sections/dashboard/task-overview'));
const MonthlyMentors = lazy(() => import('components/sections/dashboard/monthly-mentors'));

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const { data: allTasks, loading: tasksLoading } = useSelector(
    (state: RootState) => state.tasks.allTasks,
  );
  const { data: mentors, loading: mentorsLoading } = useSelector(
    (state: RootState) => state.mentors,
  );
  const { data: members, loading: membersLoading } = useSelector(
    (state: RootState) => state.members,
  );

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Only fetch data if token exists
    if (!token) return;

    if (!allTasks && !tasksLoading) dispatch(fetchAllTasks());
    if (!mentors && !mentorsLoading) dispatch(fetchMentors());
    if (!members && !membersLoading) dispatch(fetchMembers());
  }, [dispatch, allTasks, tasksLoading, mentors, mentorsLoading, members, membersLoading]);

  // Check if user needs to change password on component mount
  useEffect(() => {
    const needsPasswordChange = localStorage.getItem('needsPasswordChange') === 'true';
    if (needsPasswordChange) {
      setChangePasswordOpen(true);
    }
  }, []);

  // Check if password change is required
  const isPasswordChangeRequired = localStorage.getItem('needsPasswordChange') === 'true';

  return (
    <>
      <Stack direction={{ xs: 'column', md: 'row' }}>
        <Stack p={3.5} spacing={3.5} direction="column" width={{ xs: 1, md: 'calc(100% - 460px)' }}>
          <Stack
            width={1}
            spacing={3.5}
            direction={{ xs: 'column', sm: 'row', md: 'column', xl: 'row' }}
          >
            <Suspense fallback={<Skeleton variant="rounded" height={200} />}>
              <RunningTask />
            </Suspense>
            <Suspense fallback={<Skeleton variant="rounded" height={200} />}>
              <Activity />
            </Suspense>
          </Stack>

          <Suspense fallback={<Skeleton variant="rounded" height={300} />}>
            <MonthlyMentors />
          </Suspense>
          <Suspense fallback={<Skeleton variant="rounded" height={400} />}>
            <UpcomingTask />
          </Suspense>
          <Suspense fallback={<Skeleton variant="rounded" height={500} />}>
            <TaskOverview />
          </Suspense>

          <Box display={{ xs: 'none', md: 'block' }}>
            <Footer />
          </Box>
        </Stack>

        <Box
          width={{ xs: 1, md: 460 }}
          height={{ xs: 'auto', md: 'calc(100vh - 90px)' }}
          overflow="scroll"
          bgcolor="info.main"
          position="sticky"
          top={90}
          sx={{
            '&:hover, &:focus': {
              '&::-webkit-scrollbar-thumb': {
                visibility: 'visible',
              },
            },
          }}
        >
          <Stack p={3.5} spacing={3.5} width={1} direction="column">
            <Suspense fallback={<Skeleton variant="rounded" height={300} />}>
              <WeekCalendar />
            </Suspense>
            <Suspense fallback={<Skeleton variant="rounded" height={200} />}>
              <TaskToday />
            </Suspense>
          </Stack>

          <Box display={{ xs: 'block', md: 'none' }}>
            <Footer />
          </Box>
        </Box>
      </Stack>

      <ChangePasswordModal
        open={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
        required={isPasswordChangeRequired}
      />
    </>
  );
};

export default Dashboard;
