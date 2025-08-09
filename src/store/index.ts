import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './profileSlice';
import taskReducer from './taskSlice';
import mentorReducer from './mentorSlice';
import memberReducer from './memberSlice';
import notificationReducer from './notificationSlice';

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    tasks: taskReducer,
    mentors: mentorReducer,
    members: memberReducer,
    notifications: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;