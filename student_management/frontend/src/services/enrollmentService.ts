import type { Enrollment, EnrollmentInput } from '../types/enrollment'
import { api } from './api'

export const getEnrollments = async () => api.get<Enrollment[]>('/enrollments')

export const createEnrollment = async (input: EnrollmentInput) => api.post<Enrollment>('/enrollments', input)

export const updateEnrollment = async (id: number, input: EnrollmentInput) => api.put<Enrollment>(`/enrollments/${id}`, input)

export const deleteEnrollment = async (id: number) => api.delete<{ message: string }>(`/enrollments/${id}`)
