export type Role = 'customer' | 'admin'

export type OrderStatus = 'pending' | 'baking' | 'out_for_delivery' | 'completed' | 'cancelled'
export type FulfillmentMethod = 'pickup' | 'delivery'
export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'

export interface Profile {
  id: string
  full_name: string | null
  phone: string | null
  role: Role
}

export interface Product {
  id: string
  name: string
  description: string
  category: string
  price: number
  stock: number
  image_url: string | null
  badge: string | null
  is_available: boolean
}

export interface OrderItem {
  id: string
  product_id: string | null
  product_name: string
  unit_price: number
  quantity: number
}

export interface Order {
  id: string
  order_number: number
  customer_id: string
  status: OrderStatus
  fulfillment_method: FulfillmentMethod
  delivery_address: string | null
  contact_name: string
  contact_phone: string
  notes: string | null
  total: number
  created_at: string
  order_items?: OrderItem[]
  profiles?: { full_name: string | null } | null
}

export interface Service {
  id: string
  name: string
  description: string
  duration_minutes: number
  price: number
  tags: string[]
  is_available: boolean
}

export interface Staff {
  id: string
  name: string
  title: string
  is_active: boolean
  sort_order: number
}

export interface Appointment {
  id: string
  customer_id: string
  service_id: string | null
  service_name: string
  staff_id: string
  starts_at: string
  ends_at: string
  price: number
  status: AppointmentStatus
  notes: string | null
  staff?: { name: string } | null
  profiles?: { full_name: string | null } | null
}

export type ActionResult<T = unknown> = ({ ok: true } & T) | { ok: false; error: string }
