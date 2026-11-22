import axiosClient from './axiosClient';

export const fetchDashboard = async () => {
  const response = await axiosClient.get('/dashboard');
  return response.data;
};
