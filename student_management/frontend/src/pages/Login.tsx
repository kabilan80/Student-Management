import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Button, Form } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthBox from '../component/AuthBox'
import Field from '../component/Field'
import Message from '../component/Message'
import { useApi } from '../hooks/useApi'
import { loginUser } from '../services/authService'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { loading: loginLoading, error: loginError, callAPI: loginAPI } = useApi(loginUser)
  const [form, setForm] = useState({ email: '', password: '' })

  const registered = (location.state as { message?: string } | null)?.message

  const change = (e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await loginAPI(form.email, form.password)
      navigate('/')
    } catch {
    }
  }

  return (
    <AuthBox title="Login" text="">
      <Message text={loginError || registered} type={loginError ? 'danger' : 'success'} />
      <Form onSubmit={submit}>
        <Field id="email" label="Email">
          <Form.Control name="email" type="email" placeholder="Enter email address" value={form.email} onChange={change} required />
        </Field>
        <Field id="password" label="Password">
          <Form.Control name="password" type="password" placeholder="Enter password" value={form.password} onChange={change} required />
        </Field>
        <Button type="submit" className="full" disabled={loginLoading}>Login</Button>
      </Form>
      <p className="switch">New here? <Link to="/register">Create an account</Link></p>
    </AuthBox>
  )
}