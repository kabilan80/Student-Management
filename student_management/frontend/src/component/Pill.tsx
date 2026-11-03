export default function Pill({ status }: { status: string }) {
  return <span className={`pill pill-${status.toLowerCase()}`}>{status}</span>
}