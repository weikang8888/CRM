import API from '../index';

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

export const register = async (params?: RegisterPayload) => {
  try {
    const res = await API.post('/auth/register', params);
    return res.data;
  } catch (error: unknown) {
    return Promise.reject((error as { response?: { data?: unknown } })?.response?.data || error);
  }
};
