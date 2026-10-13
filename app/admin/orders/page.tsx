import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { OrderCard } from '@/components/AdminCards'
import type { Order } from '@/lib/types'

export const metadata = { title: 'Orders' }
const FILTERS = ['all', 'pending', 'baking', 'out_for_delivery', 'completed', 'cancelled'] as const

export default async function AdminOrders({ searchParams }: { searchParams: { status?: string } }) {
  const status = FILTERS.find((f) => f === searchParams.status) ?? 'all'
  let q = createClient().from('orders').select('*, order_items(*), profiles(full_name)')
  if (status !== 'all') q = q.eq('status', status)
  const { data } = await q.order('created_at', { ascending: false }).limit(100)
  const orders = (data ?? []) as unknown as Order[]

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-headline-lg-mobile md:text-headline-lg">Bakery orders</h1>
      <div className="no-scrollbar -mx-gutter flex gap-3 overflow-x-auto px-gutter py-2 md:mx-0 md:px-1">
        {FILTERS.map((f) => (
          <Link key={f} href={f === 'all' ? '/admin/orders' : `/admin/orders?status=${f}`}
            className={`shrink-0 rounded-md border px-4 py-2 font-display text-label-md transition-colors ${status === f ? 'is-pressed border-ink' : 'border-ink/10 bg-surface text-ink/70 hover:bg-ink/5'}`}>
            {f === 'all' ? 'All' : f.replace(/_/g, ' ')}
          </Link>
        ))}
      </div>
      {orders.length === 0 ? <p className="neo-inset rounded-lg p-6 text-center text-slate">No orders here.</p> : (
        <div className="grid gap-6 lg:grid-cols-2">{orders.map((o) => <OrderCard key={o.id} order={o} />)}</div>
      )}
    </div>
  )
}
