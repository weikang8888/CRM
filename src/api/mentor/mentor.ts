import API from '../index';

export interface MentorPayload {
  lastName: string;
  firstName: string;
  position: string;
  avatar?: File | string;
  email?: string;
}

export interface MentorResponse {
  _id: string;
  firstName: string;
  lastName: string;
  position: string;
  avatar?: string;
  email: string;
  task: number;
}

export const createMentor = async (params: MentorPayload) => {
  try {
    const res = await API.post('/mentor/create', params);
    return res.data;
  } catch (error: unknown) {
    return Promise.reject((error as { response?: { data?: unknown } })?.response?.data || error);
  }
};

export const getMentorsList = async (): Promise<MentorResponse[] | unknown> => {
  try {
    const res = await API.get('/mentor/list', {});
    return res.data;
  } catch (error) {
    return error;
  }
};

export const editMentor = async (_id: string, params: MentorPayload) => {
  try {
    const res = await API.put(`/mentor/edit/${_id}`, params);
    return res.data;
  } catch (error: unknown) {
    return Promise.reject((error as { response?: { data?: unknown } })?.response?.data || error);
  }
};

export const deleteMentor = async (_id: string) => {
  try {
    const res = await API.delete(`/mentor/delete/${_id}`);
    return res.data;
  } catch (error: unknown) {
    return Promise.reject((error as { response?: { data?: unknown } })?.response?.data || error);
  }
};
