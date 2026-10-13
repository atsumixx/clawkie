'use client'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Minus, Plus, Search, ShoppingBag, ShoppingCart } from 'lucide-react'
import type { Product } from '@/lib/types'
import { money } from '@/lib/format'
import { LOW_STOCK_THRESHOLD } from '@/lib/config'
import { useCart } from './CartProvider'
import Thumb from './Thumb'

export default function BakeryCatalog({ products }: { products: Product[] }) {
  const cart = useCart()
  const [cat, setCat] = useState('All')
  const [q, setQ] = useState('')

  const categories = useMemo(() => ['All', ...Array.from(new Set(products.map((p) => p.category)))], [products])
  const visible = useMemo(() => products.filter((p) =>
    (cat === 'All' || p.category === cat) &&
    (!q || `${p.name} ${p.description}`.toLowerCase().includes(q.toLowerCase())),
  ), [products, cat, q])

  return (
    <div className="flex flex-col gap-6">
      <label className="neo-inset flex items-center gap-3 rounded-2xl px-4 py-3">
        <Search size={18} className="text-slate" />
        <span className="sr-only">Search the bakery</span>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search loaves, pastries…"
          className="w-full bg-transparent text-body-md outline-none placeholder:text-slate" />
      </label>

      <div className="no-scrollbar -mx-gutter flex gap-3 overflow-x-auto px-gutter py-2 md:mx-0 md:px-1">
        {categories.map((c) => (
          <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c}
            className={`shrink-0 rounded-full bg-canvas px-4 py-2 font-display text-label-md transition ${cat === c ? 'is-pressed' : 'text-slate shadow-neo-pill'}`}>
            {c}{c === 'All' ? ` (${products.length})` : ''}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="neo-inset rounded-2xl p-6 text-center text-slate">Nothing matches that search.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => {
            const soldOut = p.stock <= 0
            const qty = cart.qtyOf(p.id)
            return (
              <article key={p.id} className={`neo-card flex flex-col gap-4 p-4 ${soldOut ? 'opacity-80' : ''}`}>
                <div className="relative">
                  <Thumb src={p.image_url} alt={p.name} />
                  {p.badge && !soldOut && (
                    <span className="neo-chip absolute left-3.5 top-3.5 bg-canvas/90 backdrop-blur-md">{p.badge}</span>
                  )}
                  {soldOut && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-canvas/40 backdrop-blur-[1px]">
                      <span className="neo-chip-inset px-4 py-2 uppercase">Sold out today</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className={`font-display text-headline-sm ${soldOut ? 'text-slate' : ''}`}>{p.name}</h2>
                    <span className={`font-display text-headline-sm ${soldOut ? 'text-slate line-through' : ''}`}>{money(p.price)}</span>
                  </div>
                  <p className="text-body-sm text-slate">{p.description}</p>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="neo-chip-inset uppercase">
                    {soldOut ? 'Unavailable' : p.stock <= LOW_STOCK_THRESHOLD ? `${p.stock} left` : 'Daily bake'}
                  </span>
                  {soldOut ? null : qty === 0 ? (
                    <button className="neo-btn neo-btn-sm"
                      onClick={() => cart.add({ productId: p.id, name: p.name, price: p.price, stock: p.stock, image_url: p.image_url })}>
                      <ShoppingCart size={14} /> Add to cart
                    </button>
                  ) : (
                    <div className="neo-inset flex items-center gap-3 rounded-full p-1">
                      <button aria-label={`Decrease ${p.name}`} className="neo-icon-btn !h-8 !w-8" onClick={() => cart.setQty(p.id, qty - 1)}><Minus size={14} /></button>
                      <span className="w-5 text-center font-display text-label-lg" aria-live="polite">{qty}</span>
                      <button aria-label={`Increase ${p.name}`} className="neo-icon-btn !h-8 !w-8" disabled={qty >= p.stock} onClick={() => cart.setQty(p.id, qty + 1)}><Plus size={14} /></button>
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}

      {cart.ready && cart.count > 0 && (
        <aside className="fixed inset-x-gutter bottom-24 z-30 mx-auto max-w-xl md:bottom-6">
          <Link href="/cart" className="flex items-center justify-between rounded-full bg-ink px-5 py-3.5 text-hi shadow-neo-ink">
            <span className="flex items-center gap-2 font-display text-label-lg"><ShoppingBag size={18} /> {cart.count} {cart.count === 1 ? 'item' : 'items'} · {money(cart.subtotal)}</span>
            <span className="font-display text-label-lg">View cart</span>
          </Link>
        </aside>
      )}
    </div>
  )
}
