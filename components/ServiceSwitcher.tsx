'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Croissant, Sparkles } from 'lucide-react'

export default function ServiceSwitcher() {
  const path = usePathname()
  const salon = path.startsWith('/salon')
  const base = 'flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 font-display text-label-md transition'
  return (
    <nav aria-label="Service" className="neo-inset flex w-full items-center gap-1 rounded-full p-1.5">
      <Link href="/bakery" aria-current={!salon ? 'page' : undefined}
        className={`${base} ${!salon ? 'bg-canvas text-ink shadow-neo-btn' : 'text-slate hover:text-ink'}`}>
        <Croissant size={16} /> Artisanal Bakery
      </Link>
      <Link href="/salon" aria-current={salon ? 'page' : undefined}
        className={`${base} ${salon ? 'bg-canvas text-ink shadow-neo-btn' : 'text-slate hover:text-ink'}`}>
        <Sparkles size={16} /> Nail Studio
      </Link>
    </nav>
  )
}
