'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavLinks({ isAdmin }: { isAdmin: boolean }) {
  const path = usePathname()
  const links = [
    { href: '/bakery', label: 'Bakery' },
    { href: '/salon', label: 'Nail Studio' },
    { href: '/dashboard', label: 'My Orders' },
    ...(isAdmin ? [{ href: '/admin', label: 'Studio' }] : []),
  ]
  return (
    <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
      {links.map((l) => {
        const active = path === l.href || path.startsWith(l.href + '/')
        return (
          <Link key={l.href} href={l.href} aria-current={active ? 'page' : undefined}
            className={`rounded-md px-3 py-2 font-display text-label-md transition-colors ${active ? 'bg-ink text-cream' : 'text-ink/70 hover:bg-ink/5 hover:text-ink'}`}>
            {l.label}
          </Link>
        )
      })}
    </nav>
  )
}
