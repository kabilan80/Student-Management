import { Route, Routes } from 'react-router-dom'
import Layout from './component/Layout'
import Courses from './pages/Courses'
import Dashboard from './pages/Dashboard'
import Enrollments from './pages/Enrollments'
import Login from './pages/Login'
import Register from './pages/Register'
import Students from './pages/Students'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/enrollments" element={<Enrollments />} />
      </Route>
    </Routes>
  )
}