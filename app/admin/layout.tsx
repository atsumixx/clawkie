import Link from 'next/link'
import { requireAdmin } from '@/lib/auth'

export const dynamic = 'force-dynamic'

const links = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/appointments', label: 'Appointments' },
  { href: '/admin/catalog', label: 'Catalog' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()
  return (
    <div className="flex flex-col gap-8">
      <nav aria-label="Admin" className="no-scrollbar -mx-gutter flex gap-3 overflow-x-auto px-gutter py-2 md:mx-0 md:px-1">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="neo-btn neo-btn-sm shrink-0">{l.label}</Link>
        ))}
      </nav>
      {children}
    </div>
  )
}
