import type { ReactNode } from 'react'
import PageTitle from './PageTitle'
import TopBar from './TopBar'

export default function AuthBox({ title, text, children }: { title: string; text: string; children: ReactNode }) {
  return (
    <>
      <TopBar />
      <main className="auth">
        <div className="card">
          <div className="card-pad">
            <PageTitle title={title} text={text} />
            {children}
          </div>
        </div>
      </main>
    </>
  )
}
