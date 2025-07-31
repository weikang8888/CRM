import API from '../index';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export const login = async (params?: LoginPayload) => {
  try {
    const res = await API.post('/auth/login', params);
    return res.data;
  } catch (error: unknown) {
    return Promise.reject((error as { response?: { data?: unknown } })?.response?.data || error);
  }
};

export const changePassword = async (params: ChangePasswordPayload) => {
  try {
    const res = await API.post('/auth/change-password', params);
    return res.data;
  } catch (error: unknown) {
    return Promise.reject((error as { response?: { data?: unknown } })?.response?.data || error);
  }
};
