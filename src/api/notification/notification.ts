import API from '../index';

export interface NotificationResponse {
  message: string;
  _id: string;
  userId: string;
  taskId: string;
  title: string;
  status: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationListPayload {
  userId?: string;
}

export interface NotificationListResponse {
  notifications: NotificationResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const getNotificationList = async (
  params: NotificationListPayload,
): Promise<NotificationListResponse | unknown> => {
  try {
    const res = await API.post('/notification/list', params);
    return res.data;
  } catch (error: unknown) {
    return Promise.reject((error as { response?: { data?: unknown } })?.response?.data || error);
  }
};

export const markNotificationAsRead = async (id: string) => {
  try {
    const res = await API.put(`/notification/mark-read/${id}`);
    return res.data;
  } catch (error: unknown) {
    return Promise.reject((error as { response?: { data?: unknown } })?.response?.data || error);
  }
};

export const getUnreadNotificationCount = async (userId?: string) => {
  try {
    const res = await API.post('/notification/unread-count', userId ? { userId } : {});
    return res.data;
  } catch (error: unknown) {
    return Promise.reject((error as { response?: { data?: unknown } })?.response?.data || error);
  }
};

export const markAllNotificationsAsRead = async (userId?: string) => {
  try {
    const res = await API.put('/notification/mark-all-read', userId);
    return res.data;
  } catch (error: unknown) {
    return Promise.reject((error as { response?: { data?: unknown } })?.response?.data || error);
  }
};
