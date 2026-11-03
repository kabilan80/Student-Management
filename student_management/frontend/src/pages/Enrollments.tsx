import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { Button, Form, Table } from 'react-bootstrap'
import Field from '../component/Field'
import FormBox from '../component/FormBox'
import ListBox from '../component/ListBox'
import Message from '../component/Message'
import PageTitle from '../component/PageTitle'
import Pill from '../component/Pill'
import { useApi } from '../hooks/useApi'
import { getCourses } from '../services/courseService'
import { createEnrollment, deleteEnrollment, getEnrollments, updateEnrollment } from '../services/enrollmentService'
import { getStudents } from '../services/studentService'
import type { Enrollment } from '../types/enrollment'
import { has, today } from '../utils/format'

const newForm = () => ({ studentId: '', courseId: '', date: today(), status: 'Active' })

export default function Enrollments() {
  const { data: enrollments, loading: enrollmentsLoading, error: enrollmentsError, callAPI: getEnrollmentsAPI } = useApi(getEnrollments)
  const { data: students, error: studentsError, callAPI: getStudentsAPI } = useApi(getStudents)
  const { data: courses, error: coursesError, callAPI: getCoursesAPI } = useApi(getCourses)
  const { loading: createLoading, error: createError, callAPI: createEnrollmentAPI } = useApi(createEnrollment)
  const { loading: updateLoading, error: updateError, callAPI: updateEnrollmentAPI } = useApi(updateEnrollment)
  const { error: deleteError, callAPI: deleteEnrollmentAPI } = useApi(deleteEnrollment)

  const [form, setForm] = useState(newForm)
  const [editId, setEditId] = useState<number | undefined>()
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    getEnrollmentsAPI().catch(() => undefined)
    getStudentsAPI().catch(() => undefined)
    getCoursesAPI().catch(() => undefined)
  }, [getEnrollmentsAPI, getStudentsAPI, getCoursesAPI])

  const showMessage = (text: string) => {
    setMessage(text)
    setTimeout(() => setMessage(''), 2600)
  }
  const change = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [e.target.name]: e.target.value })

  const reset = () => {
    setForm(newForm())
    setEditId(undefined)
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const body = { ...form, studentId: Number(form.studentId), courseId: Number(form.courseId) }
    try {
      if (editId) await updateEnrollmentAPI(editId, body)
      else await createEnrollmentAPI(body)
      showMessage(editId ? 'Enrollment updated successfully.' : 'Enrollment added successfully.')
      reset()
      getEnrollmentsAPI().catch(() => undefined)
    } catch {
    }
  }

  const edit = (en: Enrollment) => {
    setEditId(en.id)
    setForm({ studentId: String(en.StudentId), courseId: String(en.CourseId), date: en.date, status: en.status })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (en: Enrollment) => {
    if (!confirm('Delete this enrollment?')) return
    try {
      await deleteEnrollmentAPI(en.id)
      showMessage('Enrollment deleted successfully.')
      if (editId === en.id) reset()
      getEnrollmentsAPI().catch(() => undefined)
    } catch {
      // the message is already in deleteError
    }
  }

  const list = enrollments ?? []
  const shown = list.filter((en) => has(search, en.Student?.name, en.Course?.name, en.status, en.date))
  const error = enrollmentsError || studentsError || coursesError || createError || updateError || deleteError

  return (
    <>
      <PageTitle title="Enrollments" text="Manage student course enrollments" />
      <Message text={error || message} type={error ? 'danger' : 'success'} />

      <div className="two">
        <FormBox title={editId ? 'Edit Enrollment' : 'Add Enrollment'}>
          <Form onSubmit={submit}>
            <Field id="enrollStudent" label="Student">
              <Form.Select name="studentId" value={form.studentId} onChange={change} required>
                <option value="">Select student</option>
                {(students ?? []).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </Form.Select>
            </Field>
            <Field id="enrollCourse" label="Course">
              <Form.Select name="courseId" value={form.courseId} onChange={change} required>
                <option value="">Select course</option>
                {(courses ?? []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Form.Select>
            </Field>
            <Field id="enrollDate" label="Enrollment Date">
              <Form.Control name="date" type="date" value={form.date} onChange={change} required />
            </Field>
            <Field id="enrollStatus" label="Status">
              <Form.Select name="status" value={form.status} onChange={change}>
                <option>Active</option>
                <option>Pending</option>
                <option>Completed</option>
              </Form.Select>
            </Field>
            <Button type="submit" className="full" disabled={createLoading || updateLoading}>{editId ? 'Save Changes' : 'Add Enrollment'}</Button>
            {editId && <Button variant="light" className="full cancel" onClick={reset}>Cancel Edit</Button>}
          </Form>
        </FormBox>

        <ListBox title="Enrollment List" noun="enrollments" count={list.length} search={search} setSearch={setSearch}>
          <Table>
            <thead>
              <tr><th>ID</th><th>Student</th><th>Course</th><th>Date</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {shown.map((en) => (
                <tr key={en.id}>
                  <td>{en.id}</td><td>{en.Student?.name}</td><td>{en.Course?.name}</td><td>{en.date}</td>
                  <td><Pill status={en.status} /></td>
                  <td>
                    <div className="actions">
                      <Button variant="outline-primary" size="sm" onClick={() => edit(en)}>Edit</Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(en)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
              {shown.length === 0 && (
                <tr><td colSpan={6} className="empty">{enrollmentsLoading ? 'Loading...' : 'No enrollments found.'}</td></tr>
              )}
            </tbody>
          </Table>
        </ListBox>
      </div>
    </>
  )
}