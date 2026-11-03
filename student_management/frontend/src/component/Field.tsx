import type { ReactNode } from 'react'
import { Form } from 'react-bootstrap'

export default function Field({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return (
    <Form.Group controlId={id} className="field">
      <Form.Label>{label}</Form.Label>
      {children}
    </Form.Group>
  )
}
