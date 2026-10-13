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
      {/* Hero: the cow-spot banner with a sticker card on top */}
      <section className="neo-card relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/brand/cow-banner.jpg')" }} />
        <div className="relative flex justify-center px-4 py-12 md:py-20">
          <div className="neo-float flex max-w-xl flex-col gap-3 px-6 py-8 text-center md:px-10">
            <h1 className="outline-text font-display text-display-lg-mobile md:text-display-lg">Made fresh daily.<br />Nails by appointment.</h1>
            <p className="font-hand text-[21px] leading-6 text-slate">One little shop, two crafts. Order today’s bake or reserve a seat at the studio.</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Link href="/bakery" className="neo-card group flex flex-col gap-6 p-6 transition active:translate-x-[3px] active:translate-y-[3px] active:shadow-neo-press">
          <span className="flex h-24 w-24 items-center justify-center rounded-full shadow-neo-inset">
            <Image src="/brand/cookie-cart-logo.png" alt="" width={480} height={445} className="h-16 w-16 object-contain" />
          </span>
          <div>
            <h2 className="font-display text-headline-lg-mobile">Artisanal Bakery</h2>
            <p className="mt-1 text-body-md text-slate">Sourdough, laminated pastry and specialty bakes. Pickup or local delivery.</p>
          </div>
          <span className="neo-btn self-start">Order now <ArrowRight size={16} /></span>
        </Link>
        <Link href="/salon" className="neo-card group flex flex-col gap-6 p-6 transition active:translate-x-[3px] active:translate-y-[3px] active:shadow-neo-press">
          <span className="flex h-24 w-24 items-center justify-center rounded-full shadow-neo-inset">
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
            <Link href="/bakery" className="font-hand text-[20px] font-bold text-slate underline underline-offset-4">All bakes</Link>
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
            <Link href="/salon" className="font-hand text-[20px] font-bold text-slate underline underline-offset-4">All services</Link>
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
