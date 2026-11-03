import { useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { getMe, logoutUser } from '../services/authService'
import TopBar from './TopBar'

const menu = [
  { to: '/', name: 'Dashboard' },
  { to: '/students', name: 'Students' },
  { to: '/courses', name: 'Courses' },
  { to: '/enrollments', name: 'Enrollments' },
]

export default function Layout() {
  const navigate = useNavigate()
  const { data: me, error: meError, callAPI: getMeAPI } = useApi(getMe)
  const { callAPI: logoutAPI } = useApi(logoutUser)

  useEffect(() => {
    getMeAPI().catch(() => undefined)
  }, [getMeAPI])

  const handleLogout = async () => {
    try {
      await logoutAPI()
      navigate('/login')
    } catch {
    }
  }

  if (meError) return <Navigate to="/login" replace />
  if (!me) return <p className="loading">Loading...</p>

  return (
    <>
      <TopBar>
        <Button variant="outline-light" size="sm" onClick={handleLogout}>Logout</Button>
      </TopBar>
      <nav className="menu">
        {menu.map((m) => (
          <NavLink key={m.to} to={m.to} end={m.to === '/'}>{m.name}</NavLink>
        ))}
      </nav>
      <main className="page">
        <Outlet />
      </main>
    </>
  )
}