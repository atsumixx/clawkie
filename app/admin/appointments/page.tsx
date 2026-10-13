import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { AppointmentCard } from '@/components/AdminCards'
import type { Appointment } from '@/lib/types'

export const metadata = { title: 'Appointments' }
const FILTERS = ['upcoming', 'pending', 'confirmed', 'completed', 'cancelled'] as const

export default async function AdminAppointments({ searchParams }: { searchParams: { status?: string } }) {
  const status = FILTERS.find((f) => f === searchParams.status) ?? 'upcoming'
  let q = createClient().from('appointments').select('*, staff(name), profiles(full_name)')
  if (status === 'upcoming') q = q.in('status', ['pending', 'confirmed']).gte('starts_at', new Date().toISOString())
  else q = q.eq('status', status)
  const { data } = await q.order('starts_at', { ascending: status !== 'upcoming' ? false : true }).limit(100)
  const appts = (data ?? []) as unknown as Appointment[]

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-headline-lg-mobile md:text-headline-lg">Salon appointments</h1>
      <div className="no-scrollbar -mx-gutter flex gap-3 overflow-x-auto px-gutter py-2 md:mx-0 md:px-1">
        {FILTERS.map((f) => (
          <Link key={f} href={`/admin/appointments?status=${f}`}
            className={`shrink-0 rounded-md border px-4 py-2 font-display text-label-md transition-colors ${status === f ? 'is-pressed border-ink' : 'border-ink/10 bg-surface text-ink/70 hover:bg-ink/5'}`}>{f}</Link>
        ))}
      </div>
      {appts.length === 0 ? <p className="neo-inset rounded-lg p-6 text-center text-slate">Nothing here.</p> : (
        <div className="grid gap-6 lg:grid-cols-2">{appts.map((a) => <AppointmentCard key={a.id} appt={a} />)}</div>
      )}
    </div>
  )
}
