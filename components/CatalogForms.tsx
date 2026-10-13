import { saveProduct, saveService } from '@/app/actions/admin'
import type { Product, Service } from '@/lib/types'

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block"><span className="neo-label">{label}</span>{children}</label>
)

export function ProductForm({ p }: { p?: Product }) {
  return (
    <form action={saveProduct} className="grid gap-4 sm:grid-cols-2">
      {p && <input type="hidden" name="id" value={p.id} />}
      <Field label="Name"><input name="name" required defaultValue={p?.name} className="neo-input" /></Field>
      <Field label="Category"><input name="category" defaultValue={p?.category ?? 'General'} className="neo-input" /></Field>
      <div className="sm:col-span-2"><Field label="Description"><textarea name="description" rows={2} defaultValue={p?.description} className="neo-input" /></Field></div>
      <Field label="Price"><input name="price" type="number" step="0.01" min="0" required defaultValue={p?.price} className="neo-input" /></Field>
      <Field label="Stock"><input name="stock" type="number" step="1" min="0" required defaultValue={p?.stock ?? 0} className="neo-input" /></Field>
      <Field label="Image URL"><input name="image_url" type="url" defaultValue={p?.image_url ?? ''} className="neo-input" placeholder="https://…" /></Field>
      <Field label="Badge (optional)"><input name="badge" defaultValue={p?.badge ?? ''} className="neo-input" /></Field>
      <label className="flex items-center gap-3 sm:col-span-2">
        <input type="checkbox" name="is_available" defaultChecked={p?.is_available ?? true} className="h-5 w-5 accent-ink" />
        <span className="text-body-md">Available to customers</span>
      </label>
      <div className="sm:col-span-2"><button className="neo-btn-ink">{p ? 'Save changes' : 'Add product'}</button></div>
    </form>
  )
}

export function ServiceForm({ s }: { s?: Service }) {
  return (
    <form action={saveService} className="grid gap-4 sm:grid-cols-2">
      {s && <input type="hidden" name="id" value={s.id} />}
      <div className="sm:col-span-2"><Field label="Name"><input name="name" required defaultValue={s?.name} className="neo-input" /></Field></div>
      <div className="sm:col-span-2"><Field label="Description"><textarea name="description" rows={2} defaultValue={s?.description} className="neo-input" /></Field></div>
      <Field label="Duration (minutes)"><input name="duration_minutes" type="number" min="5" step="5" required defaultValue={s?.duration_minutes ?? 60} className="neo-input" /></Field>
      <Field label="Price"><input name="price" type="number" step="0.01" min="0" required defaultValue={s?.price} className="neo-input" /></Field>
      <div className="sm:col-span-2"><Field label="Tags (comma separated)"><input name="tags" defaultValue={s?.tags.join(', ')} className="neo-input" /></Field></div>
      <label className="flex items-center gap-3 sm:col-span-2">
        <input type="checkbox" name="is_available" defaultChecked={s?.is_available ?? true} className="h-5 w-5 accent-ink" />
        <span className="text-body-md">Open for booking</span>
      </label>
      <div className="sm:col-span-2"><button className="neo-btn-ink">{s ? 'Save changes' : 'Add service'}</button></div>
    </form>
  )
}
