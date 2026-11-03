import { Alert } from 'react-bootstrap'

export default function Message({ text, type = 'success' }: { text?: string | null; type?: 'success' | 'danger' }) {
  if (!text) return null
  return (
    <Alert variant={type === 'success' ? 'primary' : 'danger'} className="notice">
      {text}
    </Alert>
  )
}