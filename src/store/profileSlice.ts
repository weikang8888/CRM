import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProfile, ProfileResponse, getPositions } from 'api/profile/profile';
import { ApiState } from './types';

export const fetchProfile = createAsyncThunk('profile/fetchProfile', async () => {
  return await getProfile();
});

export const fetchPositions = createAsyncThunk('profile/fetchPositions', async () => {
  return await getPositions();
});

const initialState: ApiState<ProfileResponse> & {
  positions: string[];
  positionsLoading: boolean;
  positionsError: null | string;
} = {
  data: null,
  loading: false,
  error: null,
  positions: [],
  positionsLoading: false,
  positionsError: null,
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
      })
      // Positions
      .addCase(fetchPositions.pending, (state) => {
        state.positionsLoading = true;
        state.positionsError = null;
      })
      .addCase(fetchPositions.fulfilled, (state, action) => {
        state.positionsLoading = false;
        state.positions = action.payload;
        state.positionsError = null;
      })
      .addCase(fetchPositions.rejected, (state, action) => {
        state.positionsLoading = false;
        state.positions = [];
        state.positionsError = action.error?.message || 'Failed to fetch positions';
      });
  },
});

export default profileSlice.reducer;
