import axiosClient from './axiosClient';

export const fetchSettings = async () => {
  const response = await axiosClient.get('/settings');
  return response.data;
};

export const updateSettings = async (settingsData) => {
  const response = await axiosClient.put('/settings', settingsData);
  return response.data;
};
