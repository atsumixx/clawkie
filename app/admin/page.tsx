import { Banknote, Boxes, CalendarCheck, Croissant } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { LOW_STOCK_THRESHOLD, STUDIO_TZ } from '@/lib/config'
import { money } from '@/lib/format'
import { addDays, todayIn, zonedToUtc } from '@/lib/time'
import { AppointmentCard, OrderCard } from '@/components/AdminCards'
import type { Appointment, Order } from '@/lib/types'

export const metadata = { title: 'Operations' }

export default async function AdminOverview() {
  const supabase = createClient()
  const today = todayIn(STUDIO_TZ)
  const from = zonedToUtc(today, '00:00', STUDIO_TZ).toISOString()
  const to = zonedToUtc(addDays(today, 1), '00:00', STUDIO_TZ).toISOString()

  const [todayOrders, active, todayAppts, pendingAppts, lowStock] = await Promise.all([
    supabase.from('orders').select('total').gte('created_at', from).lt('created_at', to).neq('status', 'cancelled'),
    supabase.from('orders').select('*, order_items(*), profiles(full_name)').in('status', ['pending', 'baking', 'out_for_delivery']).order('created_at'),
    supabase.from('appointments').select('id, status').gte('starts_at', from).lt('starts_at', to).in('status', ['pending', 'confirmed']),
    supabase.from('appointments').select('*, staff(name), profiles(full_name)').eq('status', 'pending').gte('starts_at', new Date().toISOString()).order('starts_at'),
    supabase.from('products').select('id', { count: 'exact', head: true }).lte('stock', LOW_STOCK_THRESHOLD),
  ])

  const revenue = (todayOrders.data ?? []).reduce((n, o) => n + Number(o.total), 0)
  const orders = (active.data ?? []) as unknown as Order[]
  const baking = orders.filter((o) => o.status === 'baking').length
  const pending = (pendingAppts.data ?? []) as unknown as Appointment[]

  const stats = [
    { label: 'Revenue today', value: money(revenue), sub: 'Excludes cancelled', Icon: Banknote },
    { label: 'Bakery queue', value: `${orders.length} active`, sub: `${baking} baking now`, Icon: Croissant },
    { label: 'Appointments', value: `${todayAppts.data?.length ?? 0} today`, sub: `${pending.length} awaiting sign-off`, Icon: CalendarCheck },
    { label: 'Stock alert', value: `${lowStock.count ?? 0} low`, sub: `≤ ${LOW_STOCK_THRESHOLD} units or sold out`, Icon: Boxes },
  ]

  return (
    <div className="flex flex-col gap-10">
      <header>
        <p className="font-display text-label-sm uppercase text-slate">Master console</p>
        <h1 className="font-display text-headline-lg-mobile md:text-headline-lg">Operations</h1>
      </header>

      <section aria-label="Key metrics" className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
        {stats.map(({ label, value, sub, Icon }) => (
          <div key={label} className="neo-card flex flex-col gap-3 p-5">
            <div className="flex items-center justify-between">
              <span className="font-display text-label-sm uppercase text-slate">{label}</span>
              <Icon size={18} className="text-slate" />
            </div>
            <p className="font-display text-headline-md md:text-headline-lg">{value}</p>
            <p className="text-body-sm text-slate">{sub}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="flex flex-col gap-4">
          <h2 className="font-display text-headline-md">Bakery pipeline</h2>
          {orders.length === 0 ? <p className="neo-inset rounded-lg p-6 text-center text-slate">The oven is quiet.</p> : orders.map((o) => <OrderCard key={o.id} order={o} />)}
        </section>
        <section className="flex flex-col gap-4">
          <h2 className="font-display text-headline-md">Salon approval queue</h2>
          {pending.length === 0 ? <p className="neo-inset rounded-lg p-6 text-center text-slate">No bookings waiting.</p> : pending.map((a) => <AppointmentCard key={a.id} appt={a} />)}
        </section>
      </div>
    </div>
  )
}
