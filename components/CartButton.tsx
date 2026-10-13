'use client'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useCart } from './CartProvider'

export default function CartButton() {
  const { count, ready } = useCart()
  return (
    <Link href="/cart" aria-label={`Cart${ready ? `, ${count} items` : ''}`} className="neo-icon-btn relative">
      <ShoppingBag size={18} />
      {ready && count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 font-display text-label-sm text-hi">
          {count}
        </span>
      )}
    </Link>
  )
}
