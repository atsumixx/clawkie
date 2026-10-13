'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CalendarDays, Croissant, ShieldCheck, Sparkles, User } from 'lucide-react'

export default function BottomNav({ isAdmin, signedIn }: { isAdmin: boolean; signedIn: boolean }) {
  const path = usePathname()
  const items = [
    { href: '/bakery', label: 'Bakery', Icon: Croissant },
    { href: '/salon', label: 'Salon', Icon: Sparkles },
    { href: signedIn ? '/dashboard' : '/login', label: signedIn ? 'Orders' : 'Sign in', Icon: signedIn ? CalendarDays : User },
    ...(isAdmin ? [{ href: '/admin', label: 'Studio', Icon: ShieldCheck }] : []),
  ]
  return (
    <nav aria-label="Primary" className="pb-safe fixed inset-x-0 bottom-0 z-40 bg-canvas/90 backdrop-blur-xl md:hidden">
      <ul className="flex items-center justify-around px-3 py-2.5">
        {items.map(({ href, label, Icon }) => {
          const active = path === href || path.startsWith(href + '/')
          return (
            <li key={href}>
              <Link href={href} aria-current={active ? 'page' : undefined}
                className={`flex h-14 w-[4.5rem] flex-col items-center justify-center gap-1 rounded-full font-display text-label-sm transition ${active ? 'shadow-neo-pill-inset text-ink' : 'shadow-neo-btn text-slate'}`}>
                <Icon size={18} />
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
