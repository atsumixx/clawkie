'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { friendlyError } from '@/lib/errors'
import type { ActionResult, FulfillmentMethod } from '@/lib/types'

interface PlaceOrderInput {
  items: { productId: string; qty: number }[]
  fulfillment: FulfillmentMethod
  address?: string
  name: string
  phone: string
  notes?: string
}

export async function placeOrder(input: PlaceOrderInput): Promise<ActionResult<{ orderId: string }>> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Please sign in to place your order.' }

  if (!Array.isArray(input.items) || input.items.length === 0) return { ok: false, error: 'Your cart is empty.' }
  if (input.items.some((i) => !i.productId || !Number.isInteger(i.qty) || i.qty < 1 || i.qty > 50)) {
    return { ok: false, error: 'One of the quantities is invalid.' }
  }
  if (input.fulfillment !== 'pickup' && input.fulfillment !== 'delivery') return { ok: false, error: 'Choose pickup or delivery.' }

  const { data, error } = await supabase.rpc('place_order', {
    p_items: input.items.map((i) => ({ product_id: i.productId, qty: i.qty })),
    p_fulfillment: input.fulfillment,
    p_address: input.address ?? null,
    p_contact_name: input.name,
    p_contact_phone: input.phone,
    p_notes: input.notes ?? null,
  })
  if (error) return { ok: false, error: friendlyError(error.message) }

  revalidatePath('/bakery')
  revalidatePath('/dashboard')
  return { ok: true, orderId: data as string }
}
