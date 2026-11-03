import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Message from '../component/Message'
import PageTitle from '../component/PageTitle'
import Pill from '../component/Pill'
import { useApi } from '../hooks/useApi'
import { getCourses } from '../services/courseService'
import { getEnrollments } from '../services/enrollmentService'
import { getStudents } from '../services/studentService'
import { shortMoney } from '../utils/format'

const links = [
  { to: '/students', name: 'Student Records', text: 'Manage student details' },
  { to: '/courses', name: 'Course Catalog', text: 'Add and update courses' },
  { to: '/enrollments', name: 'Enrollment Records', text: 'Track course registrations' },
]

export default function Dashboard() {
  const { data: students, error: studentsError, callAPI: getStudentsAPI } = useApi(getStudents)
  const { data: courses, error: coursesError, callAPI: getCoursesAPI } = useApi(getCourses)
  const { data: enrollments, loading: enrollmentsLoading, error: enrollmentsError, callAPI: getEnrollmentsAPI } = useApi(getEnrollments)

  useEffect(() => {
    getStudentsAPI().catch(() => undefined)
    getCoursesAPI().catch(() => undefined)
    getEnrollmentsAPI().catch(() => undefined)
  }, [getStudentsAPI, getCoursesAPI, getEnrollmentsAPI])

  const courseList = courses ?? []
  const enrollmentList = enrollments ?? []
  const totalFees = courseList.reduce((sum, c) => sum + c.fee, 0)
  const recent = [...enrollmentList].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4)

  const stats = [
    { icon: '👨‍🎓', label: 'Total Students', value: students?.length ?? 0 },
    { icon: '📚', label: 'Total Courses', value: courseList.length },
    { icon: '📝', label: 'Enrollments', value: enrollmentList.length },
    { icon: '💰', label: 'Total Course Fees', value: shortMoney(totalFees) },
  ]

  return (
    <>
      <PageTitle title="Dashboard" text="Overview of your student course management system" />
      <Message text={studentsError || coursesError || enrollmentsError || undefined} type="danger" />

      <div className="stats">
        {stats.map((s) => (
          <div className="stat" key={s.label}>
            <div className="stat-icon">{s.icon}</div>
            <div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dash">
        <div className="card">
          <div className="section-head">
            <h2>Recent Enrollments</h2>
            <Link to="/enrollments" className="btn btn-outline-primary btn-sm">View All</Link>
          </div>
          <div className="section-body">
            {recent.map((e) => (
              <div className="row-item" key={e.id}>
                <div>
                  <div className="item-name">{e.Student?.name} <span className="muted">enrolled in</span></div>
                  <div className="muted">{e.Course?.name} · {e.date}</div>
                </div>
                <Pill status={e.status} />
              </div>
            ))}
            {recent.length === 0 && <div className="empty">{enrollmentsLoading ? 'Loading...' : 'No recent enrollments.'}</div>}
          </div>
        </div>

        <div className="card">
          <div className="section-head"><h2>Quick Overview</h2></div>
          <div className="section-body">
            {links.map((l) => (
              <div className="row-item" key={l.to}>
                <div>
                  <div className="item-name">{l.name}</div>
                  <div className="muted">{l.text}</div>
                </div>
                <Link to={l.to} className="btn btn-outline-primary btn-sm">Open</Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}