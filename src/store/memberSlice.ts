import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ApiState } from './types';
import { getMembersList, MemberResponse } from 'api/member/member';

export const fetchMembers = createAsyncThunk('members/fetchMembers', async () => {
  return await getMembersList();
});

const initialState: ApiState<MemberResponse[]> = {
  data: null,
  loading: false,
  error: null,
};

const memberSlice = createSlice({
  name: 'members',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = (action.payload as { members: MemberResponse[] })?.members || null;
        state.error = null;
      })
      .addCase(fetchMembers.rejected, (state, action) => {
        state.loading = false;
        state.data = null;
        state.error = action.error;
      });
  },
});

export default memberSlice.reducer;
