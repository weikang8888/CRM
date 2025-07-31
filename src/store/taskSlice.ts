import { createSlice, createAsyncThunk, SerializedError } from '@reduxjs/toolkit';
import { getTaskList, TaskListResponse } from 'api/task/task';

export const fetchAllTasks = createAsyncThunk('tasks/fetchAll', async () => {
  return await getTaskList({});
});

export const fetchMyTasks = createAsyncThunk(
  'tasks/fetchMine',
  async (params: { mentorId?: string; memberId?: string }) => {
    return await getTaskList(params);
  },
);

type TaskState = {
  data: TaskListResponse | null;
  loading: boolean;
  error: SerializedError | null;
};

const initialState: {
  allTasks: TaskState;
  myTasks: TaskState;
} = {
  allTasks: { data: null, loading: false, error: null },
  myTasks: { data: null, loading: false, error: null },
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // allTasks
      .addCase(fetchAllTasks.pending, (state) => {
        state.allTasks.loading = true;
        state.allTasks.error = null;
      })
      .addCase(fetchAllTasks.fulfilled, (state, action) => {
        state.allTasks.loading = false;
        state.allTasks.data = action.payload;
      })
      .addCase(fetchAllTasks.rejected, (state, action) => {
        state.allTasks.loading = false;
        state.allTasks.error = action.error;
      })
      // myTasks
      .addCase(fetchMyTasks.pending, (state) => {
        state.myTasks.loading = true;
        state.myTasks.error = null;
      })
      .addCase(fetchMyTasks.fulfilled, (state, action) => {
        state.myTasks.loading = false;
        state.myTasks.data = action.payload;
      })
      .addCase(fetchMyTasks.rejected, (state, action) => {
        state.myTasks.loading = false;
        state.myTasks.error = action.error;
      });
  },
});

export default taskSlice.reducer;
