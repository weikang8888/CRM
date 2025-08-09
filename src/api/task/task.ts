import API from '../index';

export interface TaskPayload {
  _id?: string;
  photo?: File | string;
  title: string;
  progress: number;
  status: string;
  dueDate: string;
  memberId?: string[];
  mentorId?: string;
  createdBy?: string;
}

export const createTask = async (data: TaskPayload) => {
  try {
    const payload: TaskPayload = {
      title: data.title,
      progress: data.progress,
      status: data.status,
      dueDate: data.dueDate,
    };
    if (data.memberId && data.memberId.length > 0) {
      payload.memberId = data.memberId;
    }
    if (data.mentorId) {
      payload.mentorId = data.mentorId;
    }
    if (data.createdBy) {
      payload.createdBy = data.createdBy;
    }
    const res = await API.post('/task/create', payload);
    return res.data;
  } catch (error: unknown) {
    return Promise.reject((error as { response?: { data?: unknown } })?.response?.data || error);
  }
};

export const editTask = async (data: TaskPayload) => {
  try {
    const payload: Partial<TaskPayload> = {
      title: data.title,
      progress: data.progress,
      status: data.status,
      dueDate: data.dueDate,
    };
    // Always include memberId, even if it's an empty array
    if (data.memberId !== undefined) {
      payload.memberId = data.memberId;
    }
    // Always include mentorId, even if it's empty string
    if (data.mentorId !== undefined) {
      payload.mentorId = data.mentorId;
    }
    const res = await API.put(`/task/edit/${data._id}`, payload);
    return res.data;
  } catch (error: unknown) {
    return Promise.reject((error as { response?: { data?: unknown } })?.response?.data || error);
  }
};

export const deleteTask = async (id: string) => {
  try {
    const res = await API.delete(`/task/delete/${id}`, {});
    return res.data;
  } catch (error: unknown) {
    return Promise.reject((error as { response?: { data?: unknown } })?.response?.data || error);
  }
};

export interface TaskListResponse {
  tasks: Array<{
    _id: string;
    title: string;
    progress: number;
    status: string;
    dueDate: string;
    photo?: string;
    memberId?: string[];
    mentorId?: string;
  }>;
}

export const getTaskList = async (params?: {
  mentorId?: string;
  memberId?: string;
}): Promise<TaskListResponse> => {
  try {
    const res = await API.post('/task/list', params);
    return res.data;
  } catch (error: unknown) {
    return Promise.reject((error as { response?: { data?: unknown } })?.response?.data || error);
  }
};

// Update only status for a task by member
export const updateTaskStatusProgress = async (params: {
  taskId: string;
  memberId: string;
  status: string;
}) => {
  try {
    const res = await API.put(`/task/updateStatus`, params);
    return res.data;
  } catch (error: unknown) {
    return Promise.reject((error as { response?: { data?: unknown } })?.response?.data || error);
  }
};

// Fetch tasks for a specific member
export const memberTask = async (params: { memberId: string; taskId?: string }) => {
  try {
    const res = await API.post('/task/memberTask', params);
    return res.data;
  } catch (error: unknown) {
    return Promise.reject((error as { response?: { data?: unknown } })?.response?.data || error);
  }
};
