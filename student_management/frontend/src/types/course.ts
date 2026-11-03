export interface CourseInput {
  name: string
  duration: string
  fee: number
}

export interface Course extends CourseInput {
  id: number
}
