import type { ReactNode } from 'react'

export default function FormBox({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="card">
      <div className="card-pad">
        <h2 className="card-name">{title}</h2>
        {children}
      </div>
    </div>
  )
}
