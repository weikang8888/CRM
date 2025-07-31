import MentorCard from './MentorCard';
import SliderWrapper from 'components/common/SliderWrapper';
import { useSelector } from 'react-redux';
import { RootState } from 'store';

const MonthlyMentors = () => {
  const { data: mentors } = useSelector((state: RootState) => state.mentors);

  // Map mentors to include id property for SliderWrapper
  const mappedMentors =
    mentors?.map((mentor) => ({
      ...mentor,
      id: mentor._id,
    })) || [];

  return <SliderWrapper title="Monthly Mentors" SliderCard={MentorCard} data={mappedMentors} />;
};

export default MonthlyMentors;
