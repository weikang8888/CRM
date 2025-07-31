// API to fetch profile data from crm/profile
import API from '../index';

export interface ProfileResponse {
  _id?: string;
  position: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  role: string;
  country: string;
  city: string;
  postalCode: string;
  admin: string;
  avatar?: string;
}

export interface ProfileEditPayload {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  email?: string;
  phone?: string;
  country?: string;
  city?: string;
  postalCode?: string;
  position?: string;
  avatar?: string;
}

export const getProfile = async (): Promise<ProfileResponse> => {
  const res = await API.get('/profile', {});
  return res.data;
};

export const editProfile = async (params?: ProfileEditPayload): Promise<ProfileResponse> => {
  const res = await API.put('/profile/edit', params);
  return res.data;
};

export const getPositions = async (): Promise<string[]> => {
  const res = await API.get('/profile/positions');
  return res.data.positions;
};
