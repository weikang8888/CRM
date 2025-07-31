import API from '../index';

export interface MemberPayload {
  lastName: string;
  firstName: string;
  position: string;
  avatar?: File | string;
  email?: string;
}

export interface MemberResponse {
  _id: string;
  firstName: string;
  lastName: string;
  name: string;
  position: string;
  avatar?: string;
  email: string;
  phone: string;
  joinDate: string;
}

export const createMember = async (params: MemberPayload) => {
  try {
    const res = await API.post('/member/create', params);
    return res.data;
  } catch (error: unknown) {
    return Promise.reject((error as { response?: { data?: unknown } })?.response?.data || error);
  }
};

export const getMembersList = async (): Promise<MemberResponse[] | unknown> => {
  try {
    const res = await API.get('/member/list', {});
    return res.data;
  } catch (error: unknown) {
    return Promise.reject((error as { response?: { data?: unknown } })?.response?.data || error);
  }
};

export const editMember = async (_id: string, params: MemberPayload) => {
  try {
    const res = await API.put(`/member/edit/${_id}`, params);
    return res.data;
  } catch (error: unknown) {
    return Promise.reject((error as { response?: { data?: unknown } })?.response?.data || error);
  }
};

export const deleteMember = async (_id: string) => {
  try {
    const res = await API.delete(`/member/delete/${_id}`);
    return res.data;
  } catch (error: unknown) {
    return Promise.reject((error as { response?: { data?: unknown } })?.response?.data || error);
  }
};
