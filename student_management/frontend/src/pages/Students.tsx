import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { Button, Form, Table } from 'react-bootstrap'
import Field from '../component/Field'
import FormBox from '../component/FormBox'
import ListBox from '../component/ListBox'
import Message from '../component/Message'
import PageTitle from '../component/PageTitle'
import { useApi } from '../hooks/useApi'
import type { Student } from '../types/student'
import { createStudent, deleteStudent, getStudents, updateStudent } from '../services/studentService'
import { has } from '../utils/format'

const emptyForm = { name: '', email: '', phone: '', age: '' }

export default function Students() {
  const { data: students, loading: studentsLoading, error: studentsError, callAPI: getStudentsAPI } = useApi(getStudents)
  const { loading: createLoading, error: createError, callAPI: createStudentAPI } = useApi(createStudent)
  const { loading: updateLoading, error: updateError, callAPI: updateStudentAPI } = useApi(updateStudent)
  const { error: deleteError, callAPI: deleteStudentAPI } = useApi(deleteStudent)

  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState<number | undefined>()
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    getStudentsAPI().catch(() => undefined)
  }, [getStudentsAPI])

  const showMessage = (text: string) => {
    setMessage(text)
    setTimeout(() => setMessage(''), 2600)
  }
  const change = (e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value })

  const reset = () => {
    setForm(emptyForm)
    setEditId(undefined)
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const body = { ...form, age: Number(form.age) }
    try {
      if (editId) await updateStudentAPI(editId, body)
      else await createStudentAPI(body)
      showMessage(editId ? 'Student updated successfully.' : 'Student added successfully.')
      reset()
      getStudentsAPI().catch(() => undefined)
    } catch {
    }
  }

  const edit = (s: Student) => {
    setEditId(s.id)
    setForm({ name: s.name, email: s.email, phone: s.phone, age: String(s.age) })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (s: Student) => {
    if (!confirm('Delete this student? Related enrollments will also be removed.')) return
    try {
      await deleteStudentAPI(s.id)
      showMessage('Student deleted successfully.')
      if (editId === s.id) reset()
      getStudentsAPI().catch(() => undefined)
    } catch {
    }
  }

  const list = students ?? []
  const shown = list.filter((s) => has(search, s.name, s.email, s.phone, s.age))
  const error = studentsError || createError || updateError || deleteError

  return (
    <>
      <PageTitle title="Students" text="Manage student information" />
      <Message text={error || message} type={error ? 'danger' : 'success'} />

      <div className="two">
        <FormBox title={editId ? 'Edit Student' : 'Add Student'}>
          <Form onSubmit={submit}>
            <Field id="studentName" label="Student Name">
              <Form.Control name="name" placeholder="Enter student name" value={form.name} onChange={change} required />
            </Field>
            <Field id="studentEmail" label="Email">
              <Form.Control name="email" type="email" placeholder="Enter email address" value={form.email} onChange={change} required />
            </Field>
            <Field id="studentPhone" label="Phone Number">
              <Form.Control name="phone" placeholder="Enter phone number" value={form.phone} onChange={change} required />
            </Field>
            <Field id="studentAge" label="Age">
              <Form.Control name="age" type="number" min="1" max="120" placeholder="Enter age" value={form.age} onChange={change} required />
            </Field>
            <Button type="submit" className="full" disabled={createLoading || updateLoading}>{editId ? 'Save Changes' : 'Add Student'}</Button>
            {editId && <Button variant="light" className="full cancel" onClick={reset}>Cancel Edit</Button>}
          </Form>
        </FormBox>

        <ListBox title="Student List" noun="students" count={list.length} search={search} setSearch={setSearch}>
          <Table>
            <thead>
              <tr><th>ID</th><th>Student Name</th><th>Email</th><th>Phone</th><th>Age</th><th>Action</th></tr>
            </thead>
            <tbody>
              {shown.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td><td>{s.name}</td><td>{s.email}</td><td>{s.phone}</td><td>{s.age}</td>
                  <td>
                    <div className="actions">
                      <Button variant="outline-primary" size="sm" onClick={() => edit(s)}>Edit</Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(s)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
              {shown.length === 0 && (
                <tr><td colSpan={6} className="empty">{studentsLoading ? 'Loading...' : 'No students found.'}</td></tr>
              )}
            </tbody>
          </Table>
        </ListBox>
      </div>
    </>
  )
}