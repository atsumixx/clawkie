'use client'
import Link from 'next/link'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '@/components/CartProvider'
import Thumb from '@/components/Thumb'
import { money } from '@/lib/format'

export default function CartPage() {
  const cart = useCart()
  if (!cart.ready) return <div className="neo-inset h-40 animate-pulse rounded-lg" aria-busy="true" />

  if (cart.items.length === 0) {
    return (
      <div className="neo-card mx-auto flex max-w-md flex-col items-center gap-4 p-8 text-center">
        <h1 className="font-display text-headline-md">Your cart is empty</h1>
        <p className="text-slate">Pick something from today’s bake.</p>
        <Link href="/bakery" className="neo-btn">Browse the bakery</Link>
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <section className="flex flex-col gap-4">
        <h1 className="font-display text-headline-lg-mobile md:text-headline-lg">Your cart</h1>
        {cart.items.map((i) => (
          <article key={i.productId} className="neo-card flex items-center gap-4 p-4">
            <Thumb src={i.image_url} alt={i.name} className="h-20 !w-20 shrink-0 !rounded-xl !p-1" />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-display text-headline-sm">{i.name}</h2>
                <span className="font-display text-headline-sm">{money(i.price * i.qty)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="neo-inset flex items-center gap-3 rounded-full p-1">
                  <button aria-label={`Decrease ${i.name}`} className="neo-icon-btn !h-8 !w-8" onClick={() => cart.setQty(i.productId, i.qty - 1)}><Minus size={14} /></button>
                  <span className="w-5 text-center font-display text-label-lg">{i.qty}</span>
                  <button aria-label={`Increase ${i.name}`} className="neo-icon-btn !h-8 !w-8" disabled={i.qty >= i.stock} onClick={() => cart.setQty(i.productId, i.qty + 1)}><Plus size={14} /></button>
                </div>
                <button onClick={() => cart.remove(i.productId)} className="flex items-center gap-1.5 font-display text-label-md text-slate hover:text-ink">
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      <aside className="neo-float h-fit p-6 lg:sticky lg:top-24">
        <h2 className="font-display text-headline-sm">Summary</h2>
        <dl className="mt-4 flex flex-col gap-2 text-body-md">
          <div className="flex justify-between"><dt className="text-slate">Items</dt><dd>{cart.count}</dd></div>
          <div className="flex justify-between border-t border-deep/40 pt-3"><dt className="font-display text-headline-sm">Total</dt><dd className="font-display text-headline-md">{money(cart.subtotal)}</dd></div>
        </dl>
        <Link href="/checkout" className="neo-btn-ink mt-6 w-full">Continue to checkout</Link>
        <p className="mt-3 text-center text-body-sm text-slate">Pickup or delivery is chosen next. Final prices are confirmed at checkout.</p>
      </aside>
    </div>
  )
}
