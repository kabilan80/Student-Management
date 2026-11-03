import type { RegisterInput, User } from '../types/user'
import { api } from './api'

export const registerUser = async (input: RegisterInput) => api.post<{ message: string }>('/auth/register', input)

export const loginUser = async (email: string, password: string) => api.post<User>('/auth/login', { email, password })

export const logoutUser = async () => api.post<{ message: string }>('/auth/logout')

export const getMe = async () => api.get<User>('/auth/me')
