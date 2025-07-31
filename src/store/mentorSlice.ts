import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMentorsList, MentorResponse } from 'api/mentor/mentor';
import { ApiState } from './types';

export const fetchMentors = createAsyncThunk('mentors/fetchMentors', async () => {
  return await getMentorsList();
});

const initialState: ApiState<MentorResponse[]> = {
  data: null,
  loading: false,
  error: null,
};

const mentorSlice = createSlice({
  name: 'mentors',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMentors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMentors.fulfilled, (state, action) => {
        state.loading = false;
        state.data = (action.payload as { mentors: MentorResponse[] })?.mentors || null;
        state.error = null;
      })
      .addCase(fetchMentors.rejected, (state, action) => {
        state.loading = false;
        state.data = null;
        state.error = action.error;
      });
  },
});

export default mentorSlice.reducer;
