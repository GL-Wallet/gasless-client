import { axiosInstance } from '@/shared/lib/axios';
import { CreateUser, User } from './types';

export const getUser = async (): Promise<User | null> => {
  const response = await axiosInstance.get('/user');
  return response.data;
};

export const createUser = async (data: CreateUser): Promise<User | null> => {
  const response = await axiosInstance.post('/user', data);
  return response.data;
};
