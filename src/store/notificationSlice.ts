import { createSlice, createAsyncThunk, SerializedError } from '@reduxjs/toolkit';
import {
  getNotificationList,
  getUnreadNotificationCount,
  NotificationListPayload,
  NotificationListResponse,
} from '../api/notification/notification';

export const fetchNotificationList = createAsyncThunk(
  'notifications/fetchList',
  async (params: NotificationListPayload) => {
    return await getNotificationList(params);
  },
);

export const fetchUnreadNotificationCount = createAsyncThunk(
  'notifications/fetchUnreadCount',
  async (userId?: string) => {
    return await getUnreadNotificationCount(userId);
  },
);

type NotificationState = {
  data: NotificationListResponse | null;
  loading: boolean;
  error: SerializedError | null;
};

type UnreadCountState = {
  count: number | null;
  loading: boolean;
  error: SerializedError | null;
};

const initialState: {
  notifications: NotificationState;
  unreadCount: UnreadCountState;
} = {
  notifications: { data: null, loading: false, error: null },
  unreadCount: { count: null, loading: false, error: null },
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearNotifications: (state) => {
      state.notifications.data = null;
      state.notifications.error = null;
    },
    updateUnreadCount: (state, action) => {
      state.unreadCount.count = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchNotificationList
      .addCase(fetchNotificationList.pending, (state) => {
        state.notifications.loading = true;
        state.notifications.error = null;
      })
      .addCase(fetchNotificationList.fulfilled, (state, action) => {
        state.notifications.loading = false;
        state.notifications.data = action.payload as NotificationListResponse;
      })
      .addCase(fetchNotificationList.rejected, (state, action) => {
        state.notifications.loading = false;
        state.notifications.error = action.error;
      })
      // fetchUnreadNotificationCount
      .addCase(fetchUnreadNotificationCount.pending, (state) => {
        state.unreadCount.loading = true;
        state.unreadCount.error = null;
      })
      .addCase(fetchUnreadNotificationCount.fulfilled, (state, action) => {
        state.unreadCount.loading = false;
        state.unreadCount.count = action.payload.unreadCount;
      })
      .addCase(fetchUnreadNotificationCount.rejected, (state, action) => {
        state.unreadCount.loading = false;
        state.unreadCount.error = action.error;
      });
  },
});

export const { clearNotifications, updateUnreadCount } = notificationSlice.actions;
export default notificationSlice.reducer;
