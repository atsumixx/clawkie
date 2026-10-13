'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Bike, Store } from 'lucide-react'
import { placeOrder } from '@/app/actions/orders'
import { money } from '@/lib/format'
import type { FulfillmentMethod } from '@/lib/types'
import { useCart } from './CartProvider'

export default function CheckoutForm({ defaultName, defaultPhone }: { defaultName: string; defaultPhone: string }) {
  const cart = useCart()
  const router = useRouter()
  const [method, setMethod] = useState<FulfillmentMethod>('pickup')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  if (!cart.ready) return <div className="neo-inset h-40 animate-pulse rounded-lg" aria-busy="true" />
  if (cart.items.length === 0) {
    return (
      <div className="neo-card mx-auto flex max-w-md flex-col items-center gap-4 p-8 text-center">
        <h1 className="font-display text-headline-md">Nothing to check out</h1>
        <Link href="/bakery" className="neo-btn">Browse the bakery</Link>
      </div>
    )
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (pending) return
    setError(null)
    setPending(true)
    const fd = new FormData(e.currentTarget)
    try {
      const res = await placeOrder({
        items: cart.items.map((i) => ({ productId: i.productId, qty: i.qty })),
        fulfillment: method,
        address: String(fd.get('address') ?? ''),
        name: String(fd.get('name') ?? ''),
        phone: String(fd.get('phone') ?? ''),
        notes: String(fd.get('notes') ?? ''),
      })
      if (!res.ok) { setError(res.error); return }
      cart.clear()
      router.push(`/dashboard?placed=${res.orderId}`)
    } catch {
      setError('Network problem — please try again.')
    } finally {
      setPending(false)
    }
  }

  const seg = (active: boolean) =>
    `flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 font-display text-label-md transition ${active ? 'bg-canvas shadow-neo-btn text-ink' : 'text-slate'}`

  return (
    <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-[1fr_24rem]">
      <div className="flex flex-col gap-6">
        <h1 className="font-display text-headline-lg-mobile md:text-headline-lg">Checkout</h1>

        <section className="neo-card flex flex-col gap-4 p-6">
          <h2 className="font-display text-headline-sm">Fulfillment</h2>
          <div role="radiogroup" aria-label="Fulfillment method" className="neo-inset flex gap-1 rounded-full p-1.5">
            <button type="button" role="radio" aria-checked={method === 'pickup'} onClick={() => setMethod('pickup')} className={seg(method === 'pickup')}><Store size={16} /> Pickup</button>
            <button type="button" role="radio" aria-checked={method === 'delivery'} onClick={() => setMethod('delivery')} className={seg(method === 'delivery')}><Bike size={16} /> Delivery</button>
          </div>
          {method === 'delivery' ? (
            <div>
              <label htmlFor="address" className="neo-label">Delivery address</label>
              <textarea id="address" name="address" required rows={3} className="neo-input" placeholder="Street, building, unit, landmarks…" />
            </div>
          ) : (
            <p className="neo-inset rounded-2xl px-4 py-3 text-body-sm text-slate">We’ll have your order ready at the studio. You’ll see it move through the oven in your dashboard.</p>
          )}
        </section>

        <section className="neo-card flex flex-col gap-4 p-6">
          <h2 className="font-display text-headline-sm">Contact</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label htmlFor="name" className="neo-label">Full name</label>
              <input id="name" name="name" required defaultValue={defaultName} autoComplete="name" className="neo-input" /></div>
            <div><label htmlFor="phone" className="neo-label">Mobile number</label>
              <input id="phone" name="phone" type="tel" required defaultValue={defaultPhone} autoComplete="tel" className="neo-input" /></div>
          </div>
          <div>
            <label htmlFor="notes" className="neo-label">Notes (optional)</label>
            <textarea id="notes" name="notes" rows={3} className="neo-input" placeholder="Slicing preference, allergies, gift card message…" />
          </div>
        </section>
      </div>

      <aside className="neo-float h-fit p-6 lg:sticky lg:top-24">
        <h2 className="font-display text-headline-sm">Order review</h2>
        <ul className="mt-4 flex flex-col gap-3">
          {cart.items.map((i) => (
            <li key={i.productId} className="flex items-start justify-between gap-3 text-body-md">
              <span>{i.qty} × {i.name}</span>
              <span className="font-display">{money(i.price * i.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center justify-between border-t border-deep/40 pt-4">
          <span className="font-display text-headline-sm">Total</span>
          <span className="font-display text-headline-md">{money(cart.subtotal)}</span>
        </div>
        <p className="mt-2 text-body-sm text-slate">Payment is collected on {method === 'pickup' ? 'pickup' : 'delivery'}.</p>
        {error && <p role="alert" className="neo-inset mt-4 rounded-2xl px-4 py-3 text-body-sm text-danger">{error}</p>}
        <button className="neo-btn-ink mt-5 w-full" disabled={pending}>{pending ? 'Placing order…' : `Place order · ${money(cart.subtotal)}`}</button>
        <Link href="/cart" className="mt-3 block text-center font-display text-label-md text-slate underline underline-offset-4">Back to cart</Link>
      </aside>
    </form>
  )
}
