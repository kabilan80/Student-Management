import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Button, Form } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import AuthBox from '../component/AuthBox'
import Field from '../component/Field'
import Message from '../component/Message'
import { useApi } from '../hooks/useApi'
import { registerUser } from '../services/authService'

export default function Register() {
  const navigate = useNavigate()
  const { loading: registerLoading, error: registerError, callAPI: registerAPI } = useApi(registerUser)
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [mismatch, setMismatch] = useState('')

  const change = (e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) return setMismatch('Passwords do not match')
    setMismatch('')
    const { name, email, password } = form
    try {
      await registerAPI({ name, email, password })
      navigate('/login', { state: { message: 'Registered successfully. Please login.' } })
    } catch {
    }
  }

  return (
    <AuthBox title="Register" text="Create your account">
      <Message text={mismatch || registerError || undefined} type="danger" />
      <Form onSubmit={submit}>
        <Field id="name" label="Full Name">
          <Form.Control name="name" placeholder="Enter your name" value={form.name} onChange={change} required />
        </Field>
        <Field id="email" label="Email">
          <Form.Control name="email" type="email" placeholder="Enter email address" value={form.email} onChange={change} required />
        </Field>
        <Field id="password" label="Password">
          <Form.Control name="password" type="password" minLength={6} placeholder="At least 6 characters" value={form.password} onChange={change} required />
        </Field>
        <Field id="confirm" label="Confirm Password">
          <Form.Control name="confirm" type="password" placeholder="Re-enter password" value={form.confirm} onChange={change} required />
        </Field>
        <Button type="submit" className="full" disabled={registerLoading}>Register</Button>
      </Form>
      <p className="switch">Already registered? <Link to="/login">Login</Link></p>
    </AuthBox>
  )
}