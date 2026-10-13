import { createClient } from '@/lib/supabase/server'
import ServiceSwitcher from '@/components/ServiceSwitcher'
import BakeryCatalog from '@/components/BakeryCatalog'
import type { Product } from '@/lib/types'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Artisanal Bakery' }

export default async function BakeryPage() {
  const supabase = createClient()
  const { data } = await supabase.from('products').select('*').eq('is_available', true).order('category').order('name')
  return (
    <div className="flex flex-col gap-6">
      <ServiceSwitcher />
      <header>
        <h1 className="font-display text-headline-lg-mobile md:text-headline-lg">Today’s bakes</h1>
        <p className="text-body-md text-slate">Baked in small batches. When it’s gone, it’s gone.</p>
      </header>
      <BakeryCatalog products={(data ?? []) as Product[]} />
    </div>
  )
}
