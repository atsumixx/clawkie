import Link from 'next/link'
import { CalendarClock, CircleCheck, Croissant, MapPin, Sparkles } from 'lucide-react'
import { requireUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { dateTime, money, orderRef, shortDate } from '@/lib/format'
import { cancelMyAppointment } from '@/app/actions/appointments'
import OrderTracker from '@/components/OrderTracker'
import Status from '@/components/Status'
import type { Appointment, Order } from '@/lib/types'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'My dashboard' }

const ACTIVE = ['pending', 'baking', 'out_for_delivery']

export default async function Dashboard({ searchParams }: { searchParams: { tab?: string; placed?: string; booked?: string } }) {
  const { user, profile } = await requireUser('/dashboard')
  const supabase = createClient()
  const [{ data: o }, { data: a }] = await Promise.all([
    supabase.from('orders').select('*, order_items(*)').eq('customer_id', user.id).order('created_at', { ascending: false }),
    supabase.from('appointments').select('*, staff(name)').eq('customer_id', user.id).order('starts_at', { ascending: false }),
  ])
  const orders = (o ?? []) as unknown as Order[]
  const appts = (a ?? []) as unknown as Appointment[]

  const activeOrders = orders.filter((x) => ACTIVE.includes(x.status))
  const now = Date.now()
  const upcoming = appts
    .filter((x) => ['pending', 'confirmed'].includes(x.status) && new Date(x.starts_at).getTime() > now)
    .sort((x, y) => +new Date(x.starts_at) - +new Date(y.starts_at))
  const tab = searchParams.tab === 'appointments' ? 'appointments' : 'orders'

  return (
    <div className="flex flex-col gap-8">
      <header>
        <p className="font-display text-label-sm uppercase text-slate">Welcome back</p>
        <h1 className="font-display text-display-lg-mobile md:text-display-lg">{profile?.full_name ?? 'Your dashboard'}</h1>
      </header>

      {(searchParams.placed || searchParams.booked) && (
        <p role="status" className="neo-inset flex items-center gap-2 rounded-2xl px-4 py-3 text-body-md">
          <CircleCheck size={18} />
          {searchParams.placed ? 'Order placed — we’re on it.' : 'Appointment requested — the studio will confirm it shortly.'}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="flex flex-col gap-4" aria-label="Active orders">
          <h2 className="font-display text-headline-md">Active orders</h2>
          {activeOrders.length === 0 ? (
            <div className="neo-inset rounded-lg p-6 text-center text-slate">No orders in the oven. <Link href="/bakery" className="font-semibold text-ink underline underline-offset-4">Browse the bakery</Link></div>
          ) : activeOrders.map((ord) => (
            <article key={ord.id} className="neo-card flex flex-col gap-5 p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-label-sm uppercase text-slate">Order {orderRef(ord.order_number)}</p>
                  <p className="font-display text-headline-sm">{ord.fulfillment_method === 'delivery' ? 'Delivery' : 'Studio pickup'}</p>
                </div>
                <Status status={ord.status} />
              </div>
              <p className="neo-inset rounded-2xl px-4 py-3 text-body-md">
                {(ord.order_items ?? []).map((i) => `${i.quantity}× ${i.product_name}`).join(', ')}
              </p>
              <OrderTracker status={ord.status} method={ord.fulfillment_method} />
              <div className="flex items-center justify-between">
                <span className="text-body-sm text-slate">Placed {shortDate(ord.created_at)}</span>
                <span className="font-display text-headline-sm">{money(ord.total)}</span>
              </div>
            </article>
          ))}
        </section>

        <section className="flex flex-col gap-4" aria-label="Upcoming appointment">
          <h2 className="font-display text-headline-md">Next studio session</h2>
          {upcoming.length === 0 ? (
            <div className="neo-inset rounded-lg p-6 text-center text-slate">Nothing booked. <Link href="/salon" className="font-semibold text-ink underline underline-offset-4">Book the studio</Link></div>
          ) : upcoming.slice(0, 2).map((ap) => (
            <article key={ap.id} className="neo-card flex flex-col gap-4 p-6">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-headline-sm">{ap.service_name}</h3>
                <Status status={ap.status} />
              </div>
              <dl className="neo-inset grid grid-cols-2 gap-4 rounded-2xl p-4 text-body-md">
                <div><dt className="font-display text-label-sm uppercase text-slate">Artist</dt><dd>{ap.staff?.name ?? '—'}</dd></div>
                <div><dt className="font-display text-label-sm uppercase text-slate">Price</dt><dd>{money(ap.price)}</dd></div>
                <div className="col-span-2"><dt className="font-display text-label-sm uppercase text-slate">When</dt><dd className="flex items-center gap-2"><CalendarClock size={16} />{dateTime(ap.starts_at)}</dd></div>
              </dl>
              <form action={cancelMyAppointment.bind(null, ap.id)}>
                <button className="neo-btn neo-btn-sm w-full">Cancel appointment</button>
              </form>
            </article>
          ))}
        </section>
      </div>

      <section className="flex flex-col gap-4" aria-label="Activity archive">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-headline-md">Activity archive</h2>
        </div>
        <div className="neo-inset flex rounded-md p-1.5 md:w-96">
          <Link href="/dashboard" className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2.5 font-display text-label-md transition-colors ${tab === 'orders' ? 'bg-ink text-cream' : 'text-ink/70 hover:bg-ink/5'}`}><Croissant size={14} /> Bakery orders</Link>
          <Link href="/dashboard?tab=appointments" className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2.5 font-display text-label-md transition-colors ${tab === 'appointments' ? 'bg-ink text-cream' : 'text-ink/70 hover:bg-ink/5'}`}><Sparkles size={14} /> Appointments</Link>
        </div>

        <ul className="flex flex-col gap-4">
          {tab === 'orders' ? (
            orders.length === 0 ? <li className="neo-inset rounded-lg p-6 text-center text-slate">No orders yet.</li> :
            orders.map((ord) => (
              <li key={ord.id} className="neo-card flex items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                  <p className="truncate font-display text-headline-sm">{(ord.order_items ?? []).map((i) => i.product_name).join(', ') || 'Order'}</p>
                  <p className="text-body-sm text-slate">{shortDate(ord.created_at)} · {orderRef(ord.order_number)}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <span className="font-display text-headline-sm">{money(ord.total)}</span>
                  <Status status={ord.status} />
                </div>
              </li>
            ))
          ) : appts.length === 0 ? <li className="neo-inset rounded-lg p-6 text-center text-slate">No appointments yet.</li> :
            appts.map((ap) => (
              <li key={ap.id} className="neo-card flex items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                  <p className="truncate font-display text-headline-sm">{ap.service_name}</p>
                  <p className="flex items-center gap-1.5 text-body-sm text-slate"><MapPin size={12} />{dateTime(ap.starts_at)} · {ap.staff?.name ?? '—'}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <span className="font-display text-headline-sm">{money(ap.price)}</span>
                  <Status status={ap.status} />
                </div>
              </li>
            ))}
        </ul>
      </section>
    </div>
  )
}
