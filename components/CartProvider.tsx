'use client'
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export interface CartItem {
  productId: string
  name: string
  price: number
  stock: number
  image_url: string | null
  qty: number
}

interface CartCtx {
  items: CartItem[]
  ready: boolean
  count: number
  subtotal: number
  qtyOf: (productId: string) => number
  add: (item: Omit<CartItem, 'qty'>, qty?: number) => void
  setQty: (productId: string, qty: number) => void
  remove: (productId: string) => void
  clear: () => void
}

const Ctx = createContext<CartCtx | null>(null)
const KEY = 'clawkie:cart:v1'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch {}
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    try { localStorage.setItem(KEY, JSON.stringify(items)) } catch {}
  }, [items, ready])

  const add = useCallback<CartCtx['add']>((item, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((i) => i.productId === item.productId)
      if (found) {
        return prev.map((i) =>
          i.productId === item.productId ? { ...i, ...item, qty: Math.min(item.stock, i.qty + qty) } : i,
        )
      }
      return [...prev, { ...item, qty: Math.max(1, Math.min(item.stock, qty)) }]
    })
  }, [])

  const setQty = useCallback((productId: string, qty: number) => {
    setItems((prev) =>
      prev.flatMap((i) => {
        if (i.productId !== productId) return [i]
        const next = Math.min(i.stock, qty)
        return next < 1 ? [] : [{ ...i, qty: next }]
      }),
    )
  }, [])

  const remove = useCallback((productId: string) => setItems((prev) => prev.filter((i) => i.productId !== productId)), [])
  const clear = useCallback(() => setItems([]), [])

  const value = useMemo<CartCtx>(() => ({
    items, ready,
    count: items.reduce((n, i) => n + i.qty, 0),
    subtotal: items.reduce((n, i) => n + i.qty * i.price, 0),
    qtyOf: (id) => items.find((i) => i.productId === id)?.qty ?? 0,
    add, setQty, remove, clear,
  }), [items, ready, add, setQty, remove, clear])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useCart() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useCart must be used inside <CartProvider>')
  return c
}
