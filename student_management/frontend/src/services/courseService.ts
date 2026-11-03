import type { Course, CourseInput } from '../types/course'
import { api } from './api'

export const getCourses = async () => api.get<Course[]>('/courses')

export const createCourse = async (input: CourseInput) => api.post<Course>('/courses', input)

export const updateCourse = async (id: number, input: CourseInput) => api.put<Course>(`/courses/${id}`, input)

export const deleteCourse = async (id: number) => api.delete<{ message: string }>(`/courses/${id}`)
