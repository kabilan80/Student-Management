export interface User {
  id: number
  name: string
  email: string
}

export interface RegisterInput {
  name: string
  email: string
  password: string
}
