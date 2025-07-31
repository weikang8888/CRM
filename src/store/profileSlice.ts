import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProfile, ProfileResponse } from 'api/profile/profile';
import { ApiState } from './types';

export const fetchProfile = createAsyncThunk('profile/fetchProfile', async () => {
  return await getProfile();
});

const initialState: ApiState<ProfileResponse> = {
  data: null,
  loading: false,
  error: null
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.data = null;
        state.error = action.error;
      });
  },
});

export default profileSlice.reducer;