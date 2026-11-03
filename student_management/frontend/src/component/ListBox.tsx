import type { ReactNode } from 'react'
import { Badge, Form } from 'react-bootstrap'

interface Props {
  title: string
  noun: string
  count: number
  search: string
  setSearch: (value: string) => void
  children: ReactNode // the table
}

export default function ListBox({ title, noun, count, search, setSearch, children }: Props) {
  return (
    <div className="card">
      <div className="list-head">
        <div>
          <h2>{title}</h2>
          <p>{count} {noun}</p>
        </div>
        <Badge bg="primary">Total {count}</Badge>
      </div>
      <div className="search">
        <Form.Control value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`Search ${noun}...`} />
      </div>
      <div className="table-wrap">{children}</div>
    </div>
  )
}