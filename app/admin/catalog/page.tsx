import Link from 'next/link'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { deleteProduct, deleteService, toggleProduct, toggleService } from '@/app/actions/admin'
import { ProductForm, ServiceForm } from '@/components/CatalogForms'
import { LOW_STOCK_THRESHOLD } from '@/lib/config'
import { money } from '@/lib/format'
import type { Product, Service } from '@/lib/types'

export const metadata = { title: 'Catalog' }

function Switch({ on, action, label }: { on: boolean; action: () => Promise<void>; label: string }) {
  return (
    <form action={action}>
      <button role="switch" aria-checked={on} aria-label={label}
        className={`neo-inset relative h-8 w-14 rounded-full transition`}>
        <span className={`absolute top-1 h-6 w-6 rounded-full transition-all ${on ? 'left-7 bg-ink' : 'left-1 bg-slate/60'}`} />
      </button>
    </form>
  )
}

export default async function AdminCatalog({ searchParams }: { searchParams: { tab?: string; error?: string; saved?: string } }) {
  const tab = searchParams.tab === 'services' ? 'services' : 'products'
  const supabase = createClient()
  const [{ data: p }, { data: s }] = await Promise.all([
    supabase.from('products').select('*').order('category').order('name'),
    supabase.from('services').select('*').order('name'),
  ])
  const products = (p ?? []) as Product[]
  const services = (s ?? []) as Service[]

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-headline-lg-mobile md:text-headline-lg">Catalog</h1>

      {searchParams.error && <p role="alert" className="neo-inset rounded-2xl px-4 py-3 text-body-md text-danger">{searchParams.error}</p>}
      {searchParams.saved && <p role="status" className="neo-inset rounded-2xl px-4 py-3 text-body-md">Saved.</p>}

      <div className="neo-inset flex rounded-full p-1.5 md:w-96">
        <Link href="/admin/catalog" className={`flex-1 rounded-full py-2.5 text-center font-display text-label-md ${tab === 'products' ? 'bg-canvas shadow-neo-btn' : 'text-slate'}`}>Bakery products</Link>
        <Link href="/admin/catalog?tab=services" className={`flex-1 rounded-full py-2.5 text-center font-display text-label-md ${tab === 'services' ? 'bg-canvas shadow-neo-btn' : 'text-slate'}`}>Salon services</Link>
      </div>

      <details className="neo-card group p-5">
        <summary className="flex cursor-pointer list-none items-center gap-2 font-display text-label-lg"><Plus size={16} /> Add {tab === 'products' ? 'product' : 'service'}</summary>
        <div className="mt-5">{tab === 'products' ? <ProductForm /> : <ServiceForm />}</div>
      </details>

      <ul className="flex flex-col gap-4">
        {tab === 'products' ? products.map((x) => (
          <li key={x.id} className="neo-card p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate font-display text-headline-sm">{x.name}</p>
                <p className="text-body-sm text-slate">
                  {x.category} · {money(x.price)} · {x.stock === 0 ? 'Sold out' : `${x.stock} in stock`}
                  {x.stock > 0 && x.stock <= LOW_STOCK_THRESHOLD ? ' (low)' : ''}
                </p>
              </div>
              <Switch on={x.is_available} label={`${x.name} availability`} action={toggleProduct.bind(null, x.id, !x.is_available)} />
            </div>
            <details className="mt-4">
              <summary className="flex cursor-pointer list-none items-center gap-2 font-display text-label-md text-slate"><Pencil size={14} /> Edit</summary>
              <div className="mt-4"><ProductForm p={x} /></div>
              <form action={deleteProduct.bind(null, x.id)} className="mt-4">
                <button className="flex items-center gap-1.5 font-display text-label-md text-danger"><Trash2 size={14} /> Delete product</button>
              </form>
            </details>
          </li>
        )) : services.map((x) => (
          <li key={x.id} className="neo-card p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate font-display text-headline-sm">{x.name}</p>
                <p className="text-body-sm text-slate">{x.duration_minutes} min · {money(x.price)}</p>
              </div>
              <Switch on={x.is_available} label={`${x.name} bookable`} action={toggleService.bind(null, x.id, !x.is_available)} />
            </div>
            <details className="mt-4">
              <summary className="flex cursor-pointer list-none items-center gap-2 font-display text-label-md text-slate"><Pencil size={14} /> Edit</summary>
              <div className="mt-4"><ServiceForm s={x} /></div>
              <form action={deleteService.bind(null, x.id)} className="mt-4">
                <button className="flex items-center gap-1.5 font-display text-label-md text-danger"><Trash2 size={14} /> Delete service</button>
              </form>
            </details>
          </li>
        ))}
        {(tab === 'products' ? products : services).length === 0 && <li className="neo-inset rounded-lg p-6 text-center text-slate">Nothing here yet.</li>}
      </ul>
    </div>
  )
}
