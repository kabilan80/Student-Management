import type { ReactNode } from 'react'

export default function TopBar({ children }: { children?: ReactNode }) {
  return (
    <header className="topbar">
      <div className="brand">
        <span className="cap">🎓</span>
        <span>Student Course Management</span>
      </div>
      {children}
    </header>
  )
}