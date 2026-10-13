import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { money } from '@/lib/format'
import type { Product, Service } from '@/lib/types'
import Thumb from '@/components/Thumb'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const supabase = createClient()
  const [{ data: products }, { data: services }] = await Promise.all([
    supabase.from('products').select('*').eq('is_available', true).gt('stock', 0).order('created_at').limit(3),
    supabase.from('services').select('*').eq('is_available', true).order('price').limit(3),
  ])

  return (
    <div className="flex flex-col gap-10">
      <section className="rounded-lg border border-ink/10 bg-sage/50 px-6 py-12 text-center sm:px-8 md:py-16">
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.08em] text-ink/55">clawkie · nail studio & bakery</p>
          <h1 className="text-4xl font-semibold sm:text-6xl">Nails you&apos;ll love.<br />Cookies you&apos;ll crave.</h1>
          <p className="mx-auto mt-5 max-w-md text-base text-ink/70">Book a nail appointment or order fresh-baked treats for pick-up or delivery.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/salon" className="neo-btn-ink px-6 py-3">Book nails</Link>
            <Link href="/bakery" className="neo-btn px-6 py-3">Shop bakes</Link>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Link href="/bakery" className="neo-card group flex flex-col gap-6 p-6 transition-colors hover:bg-ink/[0.02]">
          <span className="flex h-24 w-24 items-center justify-center rounded-lg bg-tan/60">
            <Image src="/brand/cookie-cart-logo.png" alt="" width={480} height={445} className="h-16 w-16 object-contain" />
          </span>
          <div>
            <h2 className="font-display text-headline-lg-mobile">Artisanal Bakery</h2>
            <p className="mt-1 text-body-md text-slate">Sourdough, laminated pastry and specialty bakes. Pickup or local delivery.</p>
          </div>
          <span className="neo-btn self-start">Order now <ArrowRight size={16} /></span>
        </Link>
        <Link href="/salon" className="neo-card group flex flex-col gap-6 p-6 transition-colors hover:bg-ink/[0.02]">
          <span className="flex h-24 w-24 items-center justify-center rounded-lg bg-sage/50">
            <Image src="/brand/clawsette-logo.png" alt="" width={480} height={392} className="h-16 w-16 object-contain" />
          </span>
          <div>
            <h2 className="font-display text-headline-lg-mobile">Nail Studio</h2>
            <p className="mt-1 text-body-md text-slate">Minimalist nail art, sculpted gel and cuticle care. Pick a service, an artist, a time.</p>
          </div>
          <span className="neo-btn self-start">Book a slot <ArrowRight size={16} /></span>
        </Link>
      </section>

      {(products?.length ?? 0) > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-headline-md">Fresh from the oven</h2>
            <Link href="/bakery" className="text-sm font-medium text-ink/70 underline underline-offset-4 hover:text-ink">All bakes</Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(products as Product[]).map((p) => (
              <Link key={p.id} href="/bakery" className="neo-card group flex flex-col gap-3 p-4 transition-colors hover:bg-ink/[0.02]">
                <Thumb src={p.image_url} alt={p.name} className="h-40" />
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-headline-sm">{p.name}</h3>
                  <span className="font-display text-headline-sm">{money(p.price)}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {(services?.length ?? 0) > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-headline-md">At the studio</h2>
            <Link href="/salon" className="text-sm font-medium text-ink/70 underline underline-offset-4 hover:text-ink">All services</Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {(services as Service[]).map((s) => (
              <Link key={s.id} href="/salon" className="neo-card group flex flex-col gap-2 p-5 transition-colors hover:bg-ink/[0.02]">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-headline-sm">{s.name}</h3>
                  <span className="font-display text-headline-sm">{money(s.price)}</span>
                </div>
                <span className="font-display text-label-sm uppercase text-slate">{s.duration_minutes} min</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
