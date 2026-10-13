import Link from 'next/link'
import { ArrowRight, Croissant, Sparkles } from 'lucide-react'
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
      <section className="flex flex-col gap-3">
        <h1 className="font-display text-display-lg-mobile md:text-display-lg">Bread at dawn.<br />Nails by appointment.</h1>
        <p className="max-w-xl text-body-lg text-slate">One atelier, two crafts. Order from today’s oven or reserve a seat at the studio.</p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Link href="/bakery" className="neo-card group flex flex-col gap-6 p-6 transition active:shadow-neo-inset">
          <span className="flex h-14 w-14 items-center justify-center rounded-full shadow-neo-btn"><Croissant /></span>
          <div>
            <h2 className="font-display text-headline-lg-mobile">Artisanal Bakery</h2>
            <p className="mt-1 text-body-md text-slate">Sourdough, laminated pastry and specialty bakes. Pickup or local delivery.</p>
          </div>
          <span className="neo-btn self-start">Order now <ArrowRight size={16} /></span>
        </Link>
        <Link href="/salon" className="neo-card group flex flex-col gap-6 p-6 transition active:shadow-neo-inset">
          <span className="flex h-14 w-14 items-center justify-center rounded-full shadow-neo-btn"><Sparkles /></span>
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
            <Link href="/bakery" className="font-display text-label-md text-slate underline underline-offset-4">All bakes</Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(products as Product[]).map((p) => (
              <Link key={p.id} href="/bakery" className="neo-card flex flex-col gap-3 p-4">
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
            <Link href="/salon" className="font-display text-label-md text-slate underline underline-offset-4">All services</Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {(services as Service[]).map((s) => (
              <Link key={s.id} href="/salon" className="neo-card flex flex-col gap-2 p-5">
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
