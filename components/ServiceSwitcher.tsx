'use client'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function ServiceSwitcher() {
  const path = usePathname()
  const salon = path.startsWith('/salon')
  const base = 'flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 font-display text-label-md transition'
  return (
    <nav aria-label="Service" className="neo-inset flex w-full items-center gap-1 rounded-full p-1.5">
      <Link href="/bakery" aria-current={!salon ? 'page' : undefined}
        className={`${base} ${!salon ? 'bg-hi text-ink shadow-neo-btn' : 'text-slate hover:text-ink'}`}>
        <Image src="/brand/cookie-cart-logo.png" alt="" width={480} height={445} className="h-8 w-8 object-contain" /> Artisanal Bakery
      </Link>
      <Link href="/salon" aria-current={salon ? 'page' : undefined}
        className={`${base} ${salon ? 'bg-hi text-ink shadow-neo-btn' : 'text-slate hover:text-ink'}`}>
        <Image src="/brand/clawsette-logo.png" alt="" width={480} height={392} className="h-8 w-8 object-contain" /> Nail Studio
      </Link>
    </nav>
  )
}
