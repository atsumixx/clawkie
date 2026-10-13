'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth'
import type { AppointmentStatus, OrderStatus } from '@/lib/types'

const ORDER_STATUSES: OrderStatus[] = ['pending', 'baking', 'out_for_delivery', 'completed', 'cancelled']
const APPT_STATUSES: AppointmentStatus[] = ['pending', 'confirmed', 'cancelled', 'completed']

function refresh() {
  revalidatePath('/admin', 'layout')
  revalidatePath('/dashboard')
  revalidatePath('/bakery')
  revalidatePath('/salon')
}

// REQ-ADM-02
export async function setOrderStatus(id: string, status: OrderStatus, _fd?: FormData): Promise<void> {
  await requireAdmin()
  if (!ORDER_STATUSES.includes(status)) return
  const supabase = createClient()
  await supabase.from('orders').update({ status }).eq('id', id)
  refresh()
}

// REQ-ADM-03
export async function setAppointmentStatus(id: string, status: AppointmentStatus, _fd?: FormData): Promise<void> {
  await requireAdmin()
  if (!APPT_STATUSES.includes(status)) return
  const supabase = createClient()
  await supabase.from('appointments').update({ status }).eq('id', id)
  refresh()
}

// ---------- REQ-ADM-04: products & services CRUD ----------
const str = (fd: FormData, k: string) => String(fd.get(k) ?? '').trim()
const num = (fd: FormData, k: string) => Number(String(fd.get(k) ?? '').replace(',', '.'))
const fail = (msg: string): never => redirect(`/admin/catalog?error=${encodeURIComponent(msg)}`)

export async function saveProduct(fd: FormData): Promise<void> {
  await requireAdmin()
  const id = str(fd, 'id')
  const row = {
    name: str(fd, 'name'),
    description: str(fd, 'description'),
    category: str(fd, 'category') || 'General',
    price: num(fd, 'price'),
    stock: Math.trunc(num(fd, 'stock')),
    image_url: str(fd, 'image_url') || null,
    badge: str(fd, 'badge') || null,
    is_available: fd.get('is_available') === 'on',
  }
  if (!row.name) fail('Product name is required.')
  if (!Number.isFinite(row.price) || row.price < 0) fail('Enter a valid price.')
  if (!Number.isFinite(row.stock) || row.stock < 0) fail('Enter a valid stock number.')

  const supabase = createClient()
  const { error } = id ? await supabase.from('products').update(row).eq('id', id) : await supabase.from('products').insert(row)
  if (error) fail(error.message)
  refresh()
  redirect('/admin/catalog?saved=1')
}

export async function toggleProduct(id: string, value: boolean, _fd?: FormData): Promise<void> {
  await requireAdmin()
  await createClient().from('products').update({ is_available: value }).eq('id', id)
  refresh()
}

export async function deleteProduct(id: string, _fd?: FormData): Promise<void> {
  await requireAdmin()
  const { error } = await createClient().from('products').delete().eq('id', id)
  if (error) fail(error.message)
  refresh()
}

export async function saveService(fd: FormData): Promise<void> {
  await requireAdmin()
  const id = str(fd, 'id')
  const row = {
    name: str(fd, 'name'),
    description: str(fd, 'description'),
    duration_minutes: Math.trunc(num(fd, 'duration_minutes')),
    price: num(fd, 'price'),
    tags: str(fd, 'tags').split(',').map((t) => t.trim()).filter(Boolean),
    is_available: fd.get('is_available') === 'on',
  }
  if (!row.name) fail('Service name is required.')
  if (!Number.isFinite(row.price) || row.price < 0) fail('Enter a valid price.')
  if (!Number.isFinite(row.duration_minutes) || row.duration_minutes < 5) fail('Duration must be at least 5 minutes.')

  const supabase = createClient()
  const { error } = id ? await supabase.from('services').update(row).eq('id', id) : await supabase.from('services').insert(row)
  if (error) fail(error.message)
  refresh()
  redirect('/admin/catalog?tab=services&saved=1')
}

export async function toggleService(id: string, value: boolean, _fd?: FormData): Promise<void> {
  await requireAdmin()
  await createClient().from('services').update({ is_available: value }).eq('id', id)
  refresh()
}

export async function deleteService(id: string, _fd?: FormData): Promise<void> {
  await requireAdmin()
  const { error } = await createClient().from('services').delete().eq('id', id)
  if (error) fail(error.message)
  refresh()
}
