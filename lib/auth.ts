import { redirect } from 'next/navigation'
import { createClient } from './supabase/server'
import type { Profile } from './types'

export async function getSessionProfile() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { user: null, profile: null as Profile | null }
  const { data } = await supabase.from('profiles').select('id, full_name, phone, role').eq('id', user.id).maybeSingle()
  return { user, profile: (data as Profile | null) ?? null }
}

export async function requireUser(next = '/dashboard') {
  const s = await getSessionProfile()
  if (!s.user) redirect(`/login?next=${encodeURIComponent(next)}`)
  return s as { user: NonNullable<typeof s.user>; profile: Profile | null }
}

/** REQ-AUTH-03 (second line of defence behind middleware) */
export async function requireAdmin() {
  const s = await requireUser('/admin')
  if (s.profile?.role !== 'admin') redirect('/')
  return s
}
