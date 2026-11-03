import type { Course } from './course'
import type { Student } from './student'

export interface EnrollmentInput {
  studentId: number
  courseId: number
  date: string
  status: string
}

// The server sends the student and course together with each enrollment.
export interface Enrollment {
  id: number
  StudentId: number
  CourseId: number
  date: string
  status: string
  Student?: Student
  Course?: Course
}
