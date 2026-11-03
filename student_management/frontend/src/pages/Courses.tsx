import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { Button, Form, Table } from 'react-bootstrap'
import Field from '../component/Field'
import FormBox from '../component/FormBox'
import ListBox from '../component/ListBox'
import Message from '../component/Message'
import PageTitle from '../component/PageTitle'
import { useApi } from '../hooks/useApi'
import type { Course } from '../types/course'
import { createCourse, deleteCourse, getCourses, updateCourse } from '../services/courseService'
import { has, money } from '../utils/format'

const emptyForm = { name: '', duration: '', fee: '' }

export default function Courses() {
  const { data: courses, loading: coursesLoading, error: coursesError, callAPI: getCoursesAPI } = useApi(getCourses)
  const { loading: createLoading, error: createError, callAPI: createCourseAPI } = useApi(createCourse)
  const { loading: updateLoading, error: updateError, callAPI: updateCourseAPI } = useApi(updateCourse)
  const { error: deleteError, callAPI: deleteCourseAPI } = useApi(deleteCourse)

  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState<number | undefined>()
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    getCoursesAPI().catch(() => undefined)
  }, [getCoursesAPI])

  const showMessage = (text: string) => {setMessage(text)
    setTimeout(() => setMessage(''), 2600)}
  const change = (e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value })

  const reset = () => {
    setForm(emptyForm)
    setEditId(undefined)
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const body = { ...form, fee: Number(form.fee) }
    try {
      if (editId) await updateCourseAPI(editId, body)
      else await createCourseAPI(body)
      showMessage(editId ? 'Course updated successfully.' : 'Course added successfully.')
      reset()
      getCoursesAPI().catch(() => undefined)
    } catch {
    }
  }

  const edit = (c: Course) => {
    setEditId(c.id)
    setForm({ name: c.name, duration: c.duration, fee: String(c.fee) })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (c: Course) => {
    if (!confirm('Delete this course? Related enrollments will also be removed.')) return
    try {
      await deleteCourseAPI(c.id)
      showMessage('Course deleted successfully.')
      if (editId === c.id) reset()
      getCoursesAPI().catch(() => undefined)
    } catch {
    }
  }

  const list = courses ?? []
  const shown = list.filter((c) => has(search, c.name, c.duration, c.fee))
  const error = coursesError || createError || updateError || deleteError

  return (
    <>
      <PageTitle title="Courses" text="Manage course information" />
      <Message text={error || message} type={error ? 'danger' : 'success'} />

      <div className="two">
        <FormBox title={editId ? 'Edit Course' : 'Add Course'}>
          <Form onSubmit={submit}>
            <Field id="courseName" label="Course Name">
              <Form.Control name="name" placeholder="Enter course name" value={form.name} onChange={change} required />
            </Field>
            <Field id="courseDuration" label="Duration">
              <Form.Control name="duration" placeholder="Enter duration (e.g. 4 Years)" value={form.duration} onChange={change} required />
            </Field>
            <Field id="courseFee" label="Fee (₹)">
              <Form.Control name="fee" type="number" min="0" step="0.01" placeholder="Enter course fee" value={form.fee} onChange={change} required />
            </Field>
            <Button type="submit" className="full" disabled={createLoading || updateLoading}>{editId ? 'Save Changes' : 'Add Course'}</Button>
            {editId && <Button variant="light" className="full cancel" onClick={reset}>Cancel Edit</Button>}
          </Form>
        </FormBox>

        <ListBox title="Course List" noun="courses" count={list.length} search={search} setSearch={setSearch}>
          <Table>
            <thead>
              <tr><th>ID</th><th>Course Name</th><th>Duration</th><th>Fee</th><th>Action</th></tr>
            </thead>
            <tbody>
              {shown.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td><td>{c.name}</td><td>{c.duration}</td><td>{money(c.fee)}</td>
                  <td>
                    <div className="actions">
                      <Button variant="outline-primary" size="sm" onClick={() => edit(c)}>Edit</Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(c)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
              {shown.length === 0 && (
                <tr><td colSpan={5} className="empty">{coursesLoading ? 'Loading...' : 'No courses found.'}</td></tr>
              )}
            </tbody>
          </Table>
        </ListBox>
      </div>
    </>
  )
}