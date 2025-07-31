import TaskCard from './TaskCard';
import SliderWrapper from 'components/common/SliderWrapper';
import { RootState } from 'store';
import { useSelector } from 'react-redux';

const UpcomingTask = () => {
  const { data: allTasks } = useSelector((state: RootState) => state.tasks.allTasks);

  // Map tasks to include id property for SliderWrapper and ensure memberId is present
  const mappedTasks =
    allTasks?.tasks?.map((task) => ({
      ...task,
      id: task._id,
      memberId: task.memberId || [],
    })) || [];

  return <SliderWrapper title="Upcoming Task" SliderCard={TaskCard} data={mappedTasks} />;
};

export default UpcomingTask;
