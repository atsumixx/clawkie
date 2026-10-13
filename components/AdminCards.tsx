import { Check, Clock, User, X } from 'lucide-react'
import { setAppointmentStatus, setOrderStatus } from '@/app/actions/admin'
import { dateTime, money, orderRef, shortDate, statusLabel } from '@/lib/format'
import type { Appointment, Order, OrderStatus } from '@/lib/types'
import Status from './Status'

export function OrderCard({ order }: { order: Order }) {
  const stages: OrderStatus[] = order.fulfillment_method === 'delivery'
    ? ['pending', 'baking', 'out_for_delivery', 'completed']
    : ['pending', 'baking', 'completed']
  const closed = order.status === 'cancelled' || order.status === 'completed'
  return (
    <article className="neo-card flex flex-col gap-4 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-headline-sm">{orderRef(order.order_number)}</h3>
          <p className="text-body-sm text-slate">
            {order.profiles?.full_name ?? order.contact_name} · {order.contact_phone} · {shortDate(order.created_at)}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className="font-display text-headline-sm">{money(order.total)}</span>
          <Status status={order.status} />
        </div>
      </div>

      <ul className="flex flex-wrap gap-2">
        {(order.order_items ?? []).map((i) => <li key={i.id} className="neo-chip">{i.quantity}× {i.product_name}</li>)}
      </ul>

      <p className="neo-inset rounded-2xl px-4 py-3 text-body-sm text-slate">
        <b className="text-ink">{order.fulfillment_method === 'delivery' ? 'Delivery' : 'Pickup'}</b>
        {order.delivery_address ? ` — ${order.delivery_address}` : ''}
        {order.notes ? <><br />Note: {order.notes}</> : null}
      </p>

      <div>
        <p className="mb-2 font-display text-label-sm uppercase text-slate">Advance stage</p>
        <div className="neo-inset flex flex-wrap gap-1 rounded-full p-1">
          {stages.map((s) => (
            <form key={s} action={setOrderStatus.bind(null, order.id, s)} className="flex-1">
              <button disabled={order.status === s || order.status === 'cancelled'}
                className={`w-full rounded-full px-3 py-2 font-display text-label-md ${order.status === s ? 'bg-canvas shadow-neo-btn text-ink' : 'text-slate hover:text-ink'}`}>
                {statusLabel[s]}
              </button>
            </form>
          ))}
        </div>
        {!closed && (
          <form action={setOrderStatus.bind(null, order.id, 'cancelled')} className="mt-3">
            <button className="font-display text-label-md text-danger underline underline-offset-4">Cancel order (restocks items)</button>
          </form>
        )}
      </div>
    </article>
  )
}

export function AppointmentCard({ appt }: { appt: Appointment }) {
  const name = appt.profiles?.full_name ?? 'Customer'
  return (
    <article className="neo-card flex flex-col gap-4 p-5">
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-canvas font-display shadow-neo-inset">
          {name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-headline-sm">{name}</h3>
            <Status status={appt.status} />
          </div>
          <p className="font-display text-body-lg">{appt.service_name}</p>
          <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-body-sm text-slate">
            <span className="flex items-center gap-1"><Clock size={13} />{dateTime(appt.starts_at)}</span>
            <span className="flex items-center gap-1"><User size={13} />{appt.staff?.name ?? '—'}</span>
            <span>{money(appt.price)}</span>
          </p>
          {appt.notes && <p className="neo-inset mt-3 rounded-2xl px-3 py-2 text-body-sm">{appt.notes}</p>}
        </div>
      </div>
      <div className="flex gap-3">
        {appt.status === 'pending' && (
          <>
            <form action={setAppointmentStatus.bind(null, appt.id, 'cancelled')} className="flex-1">
              <button className="neo-btn w-full"><X size={16} /> Decline</button>
            </form>
            <form action={setAppointmentStatus.bind(null, appt.id, 'confirmed')} className="flex-1">
              <button className="neo-btn-ink w-full"><Check size={16} /> Confirm</button>
            </form>
          </>
        )}
        {appt.status === 'confirmed' && (
          <>
            <form action={setAppointmentStatus.bind(null, appt.id, 'cancelled')} className="flex-1">
              <button className="neo-btn w-full"><X size={16} /> Cancel</button>
            </form>
            <form action={setAppointmentStatus.bind(null, appt.id, 'completed')} className="flex-1">
              <button className="neo-btn-ink w-full"><Check size={16} /> Mark completed</button>
            </form>
          </>
        )}
      </div>
    </article>
  )
}
