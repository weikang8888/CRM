import API from '../index';

export interface UploadPhotoParams {
  type: 'task' | 'profile' | 'mentor' | 'member';
  refId: string;
  photo: File;
}

export const uploadPhoto = async ({ type, refId, photo }: UploadPhotoParams) => {
  const formData = new FormData();
  formData.append('type', type);
  formData.append('refId', refId);
  formData.append('photo', photo);
  const res = await API.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};



