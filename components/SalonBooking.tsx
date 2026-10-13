'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Check, Info } from 'lucide-react'
import type { Service, Staff } from '@/lib/types'
import { money } from '@/lib/format'
import { bookAppointment, getAvailableSlots, type Slot } from '@/app/actions/appointments'

interface Day { date: string; weekday: string; day: number; long: string }

export default function SalonBooking({ services, staff, days, signedIn }: {
  services: Service[]; staff: Staff[]; days: Day[]; signedIn: boolean
}) {
  const router = useRouter()
  const [serviceId, setServiceId] = useState<string | null>(null)
  const [staffId, setStaffId] = useState<string | null>(null) // null = any available artist
  const [date, setDate] = useState(days[0]?.date ?? '')
  const [time, setTime] = useState<string | null>(null)
  const [slots, setSlots] = useState<Slot[] | null>(null)
  const [slotError, setSlotError] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const service = services.find((s) => s.id === serviceId) ?? null
  const artist = staff.find((s) => s.id === staffId) ?? null
  const day = days.find((d) => d.date === date)
  const chosenSlot = slots?.find((s) => s.time === time)

  useEffect(() => {
    setTime(null)
    setSlots(null)
    setSlotError(null)
    if (!serviceId || !date) return
    let cancelled = false
    getAvailableSlots({ serviceId, date, staffId }).then((r) => {
      if (cancelled) return
      if (r.ok) setSlots(r.slots)
      else setSlotError(r.error)
    })
    return () => { cancelled = true }
  }, [serviceId, staffId, date])

  async function reserve() {
    if (!serviceId || !time || pending) return
    if (!signedIn) { router.push('/login?next=/salon'); return }
    setError(null)
    setPending(true)
    try {
      const r = await bookAppointment({ serviceId, staffId, date, time, notes })
      if (r.ok) { router.push(`/dashboard?tab=appointments&booked=${r.appointmentId}`); return }
      if (r.error === 'auth') { router.push('/login?next=/salon'); return }
      setError(r.error)
      // refresh slots so a just-taken one disappears
      const fresh = await getAvailableSlots({ serviceId, date, staffId })
      if (fresh.ok) { setSlots(fresh.slots); setTime(null) }
    } catch {
      setError('Network problem — please try again.')
    } finally {
      setPending(false)
    }
  }

  const step = 'font-display text-label-sm uppercase text-slate'

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <div className="flex flex-col gap-8">
        {/* 1. Service */}
        <section aria-labelledby="s1" className="flex flex-col gap-4">
          <h2 id="s1" className={step}>Select service</h2>
          {services.length === 0 && <p className="neo-inset rounded-2xl p-6 text-center text-slate">No services are open for booking right now.</p>}
          <div className="grid gap-4 md:grid-cols-2">
            {services.map((s) => {
              const on = s.id === serviceId
              return (
                <button key={s.id} type="button" aria-pressed={on} onClick={() => setServiceId(s.id)}
                  className={`flex flex-col gap-3 rounded-lg bg-canvas p-5 text-left transition ${on ? 'shadow-neo-inset' : 'shadow-neo-raised'}`}>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-headline-sm">{s.name}</h3>
                    <div className="shrink-0 text-right">
                      <div className="font-display text-headline-sm">{money(s.price)}</div>
                      <div className="text-body-sm text-slate">{s.duration_minutes} min</div>
                    </div>
                  </div>
                  <p className="text-body-sm text-slate">{s.description}</p>
                  {s.tags.length > 0 && <div className="flex flex-wrap gap-2">{s.tags.map((t) => <span key={t} className="neo-chip">{t}</span>)}</div>}
                </button>
              )
            })}
          </div>
        </section>

        {/* 2. Artist */}
        <section aria-labelledby="s2" className="flex flex-col gap-4">
          <h2 id="s2" className={step}>Choose your artist</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {[{ id: null as string | null, name: 'No preference', title: 'First available' }, ...staff].map((p) => {
              const on = p.id === staffId
              return (
                <button key={p.id ?? 'any'} type="button" aria-pressed={on} onClick={() => setStaffId(p.id)}
                  className={`flex items-center justify-between gap-2 rounded-lg bg-canvas p-4 text-left transition ${on ? 'shadow-neo-inset' : 'shadow-neo-raised'}`}>
                  <span>
                    <span className="block font-display text-headline-sm">{p.name}</span>
                    <span className="block text-body-sm text-slate">{p.title}</span>
                  </span>
                  {on && <Check size={18} />}
                </button>
              )
            })}
          </div>
        </section>

        {/* 3. Date */}
        <section aria-labelledby="s3" className="flex flex-col gap-4">
          <h2 id="s3" className={step}>Select date</h2>
          <div className="no-scrollbar -mx-gutter flex gap-3 overflow-x-auto px-gutter py-3 md:mx-0 md:px-1">
            {days.map((d) => {
              const on = d.date === date
              return (
                <button key={d.date} type="button" aria-pressed={on} onClick={() => setDate(d.date)}
                  className={`flex h-24 w-16 shrink-0 flex-col items-center justify-center rounded-full bg-canvas font-display transition ${on ? 'shadow-neo-pill-inset text-ink' : 'shadow-neo-btn text-slate'}`}>
                  <span className="text-label-sm uppercase">{d.weekday}</span>
                  <span className="text-headline-md">{d.day}</span>
                </button>
              )
            })}
          </div>
        </section>

        {/* 4. Time */}
        <section aria-labelledby="s4" className="flex flex-col gap-4">
          <h2 id="s4" className={step}>Available hours</h2>
          {!service ? (
            <p className="neo-inset rounded-2xl p-5 text-body-md text-slate">Choose a service to see open times.</p>
          ) : slotError ? (
            <p role="alert" className="neo-inset rounded-2xl p-5 text-body-md text-danger">{slotError}</p>
          ) : !slots ? (
            <div className="neo-inset h-24 animate-pulse rounded-2xl" aria-busy="true" />
          ) : slots.every((s) => !s.available) ? (
            <p className="neo-inset rounded-2xl p-5 text-body-md text-slate">Fully booked on this day. Try another date or artist.</p>
          ) : (
            <div className="grid grid-cols-3 gap-3 md:grid-cols-4">
              {slots.map((s) => (
                <button key={s.time} type="button" disabled={!s.available} aria-pressed={s.time === time} onClick={() => setTime(s.time)}
                  className={`rounded-full bg-canvas py-3 font-display text-label-md transition ${
                    !s.available ? 'pointer-events-none opacity-40 line-through' : s.time === time ? 'is-pressed' : 'shadow-neo-btn'}`}>
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="flex flex-col gap-2">
          <label htmlFor="notes" className={step}>Notes for your artist (optional)</label>
          <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} maxLength={500} className="neo-input" placeholder="Inspiration, nail concerns, allergies…" />
        </section>
      </div>

      {/* Summary */}
      <aside className="neo-float h-fit p-6 lg:sticky lg:top-24">
        <h2 className="font-display text-headline-sm">Reservation summary</h2>
        <dl className="mt-4 flex flex-col gap-3 text-body-md">
          <Row k="Service" v={service?.name} />
          <Row k="Artist" v={service ? (artist?.name ?? 'First available') : undefined} />
          <Row k="Date" v={day?.long} />
          <Row k="Time" v={chosenSlot?.label} />
          <Row k="Duration" v={service ? `${service.duration_minutes} min` : undefined} />
          <div className="flex justify-between border-t border-deep/40 pt-3">
            <dt className="font-display text-headline-sm">Total</dt>
            <dd className="font-display text-headline-md">{service ? money(service.price) : '—'}</dd>
          </div>
        </dl>
        <p className="neo-inset mt-4 flex gap-2 rounded-2xl p-3 text-body-sm text-slate"><Info size={16} className="mt-0.5 shrink-0" />Your booking starts as <b className="mx-1 text-ink">pending</b> until the studio confirms it. Pay at the studio.</p>
        {error && <p role="alert" className="neo-inset mt-4 rounded-2xl px-4 py-3 text-body-sm text-danger">{error}</p>}
        <button className="neo-btn-ink mt-5 w-full" disabled={!service || !time || pending} onClick={reserve}>
          {pending ? 'Reserving…' : signedIn ? 'Reserve time slot' : 'Sign in to reserve'}
        </button>
        {!signedIn && <p className="mt-3 text-center text-body-sm text-slate">No account? <Link className="underline underline-offset-4" href="/signup?next=/salon">Create one</Link></p>}
      </aside>
    </div>
  )
}

function Row({ k, v }: { k: string; v?: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-slate">{k}</dt>
      <dd className="text-right font-medium">{v ?? <span className="text-slate">—</span>}</dd>
    </div>
  )
}
