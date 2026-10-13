import { statusLabel } from '@/lib/format'

export default function Status({ status }: { status: string }) {
  const dim = status === 'cancelled'
  return (
    <span className={`neo-chip ${dim ? 'opacity-60 line-through' : ''}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${status === 'baking' ? 'animate-pulse bg-ink' : status === 'pending' ? 'bg-slate' : 'bg-ink'}`} />
      {statusLabel[status] ?? status}
    </span>
  )
}
