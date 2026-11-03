export interface StudentInput {
  name: string
  email: string
  phone: string
  age: number
}

export interface Student extends StudentInput {
  id: number
}
