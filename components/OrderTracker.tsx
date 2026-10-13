import { Check, Flame, Package, Truck } from 'lucide-react'
import type { FulfillmentMethod, OrderStatus } from '@/lib/types'

export default function OrderTracker({ status, method }: { status: OrderStatus; method: FulfillmentMethod }) {
  const steps = [
    { key: 'pending', label: 'Received', Icon: Check },
    { key: 'baking', label: 'Baking', Icon: Flame },
    ...(method === 'delivery' ? [{ key: 'out_for_delivery', label: 'On the way', Icon: Truck }] : []),
    { key: 'completed', label: method === 'delivery' ? 'Delivered' : 'Collected', Icon: Package },
  ]
  const idx = steps.findIndex((s) => s.key === status)
  return (
    <ol className="flex items-start justify-between" aria-label="Order progress">
      {steps.map((s, i) => {
        const done = i <= idx
        return (
          <li key={s.key} className="flex flex-1 flex-col items-center gap-2 text-center" aria-current={i === idx ? 'step' : undefined}>
            <span className={`flex h-10 w-10 items-center justify-center rounded-full ${done ? 'bg-ink text-cream shadow-sm' : 'bg-sage/40 text-ink/60'}`}>
              <s.Icon size={16} />
            </span>
            <span className={`font-display text-label-sm ${done ? 'text-ink' : 'text-slate'}`}>{s.label}</span>
          </li>
        )
      })}
    </ol>
  )
}
