export default function PageTitle({ title, text }: { title: string; text: string }) {
  return (
    <>
      <h1 className="title">{title}</h1>
      <p className="subtitle">{text}</p>
    </>
  )
}
