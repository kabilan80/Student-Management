import type { Student, StudentInput } from '../types/student'
import { api } from './api'

export const getStudents = async () => api.get<Student[]>('/students')

export const createStudent = async (input: StudentInput) => api.post<Student>('/students', input)

export const updateStudent = async (id: number, input: StudentInput) => api.put<Student>(`/students/${id}`, input)

export const deleteStudent = async (id: number) => api.delete<{ message: string }>(`/students/${id}`)
