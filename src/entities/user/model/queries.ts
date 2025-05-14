import type { CreateUser, User } from './types'

import { axiosInstance } from '@/shared/lib/axios'

export async function getUser(): Promise<User | null> {
  const response = await axiosInstance.get('/user')
  return response.data
}

export async function createUser(data: CreateUser): Promise<User | null> {
  const response = await axiosInstance.post('/user', data)
  return response.data
}

export async function updateUser(data: Partial<User>): Promise<User | null> {
  const response = await axiosInstance.patch('/user', data)
  return response.data
}
