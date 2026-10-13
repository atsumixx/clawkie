'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { friendlyError } from '@/lib/errors'
import { BOOKING_WINDOW_DAYS, SALON_CLOSE, SALON_OPEN, SLOT_STEP_MIN, STUDIO_TZ } from '@/lib/config'
import { addDays, fromMinutes, timeLabel, toMinutes, todayIn, zonedToUtc } from '@/lib/time'
import type { ActionResult } from '@/lib/types'

export interface Slot { time: string; label: string; available: boolean }

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const TIME_RE = /^\d{2}:\d{2}$/

function dateInWindow(date: string) {
  if (!DATE_RE.test(date)) return false
  const today = todayIn(STUDIO_TZ)
  return date >= today && date <= addDays(today, BOOKING_WINDOW_DAYS)
}

/** REQ-NAIL-02: free slots for a service, accounting for its duration + existing bookings. */
export async function getAvailableSlots(input: { serviceId: string; date: string; staffId: string | null }): Promise<ActionResult<{ slots: Slot[] }>> {
  if (!dateInWindow(input.date)) return { ok: false, error: 'That date is outside the booking window.' }
  const supabase = createClient()

  const [{ data: service }, { data: staff }] = await Promise.all([
    supabase.from('services').select('duration_minutes').eq('id', input.serviceId).eq('is_available', true).maybeSingle(),
    supabase.from('staff').select('id').eq('is_active', true),
  ])
  if (!service) return { ok: false, error: 'Service not found.' }
  const staffIds = input.staffId ? [input.staffId] : (staff ?? []).map((s) => s.id as string)
  if (staffIds.length === 0) return { ok: false, error: 'No artists are available.' }

  const dayStart = zonedToUtc(input.date, '00:00', STUDIO_TZ)
  const dayEnd = zonedToUtc(addDays(input.date, 1), '00:00', STUDIO_TZ)
  const { data: busy, error } = await supabase.rpc('get_busy_ranges', { p_from: dayStart.toISOString(), p_to: dayEnd.toISOString() })
  if (error) return { ok: false, error: friendlyError(error.message) }
  const ranges = ((busy ?? []) as { staff_id: string; starts_at: string; ends_at: string }[]).map((b) => ({
    staff_id: b.staff_id, s: new Date(b.starts_at).getTime(), e: new Date(b.ends_at).getTime(),
  }))

  const dur = service.duration_minutes as number
  const open = toMinutes(SALON_OPEN)
  const close = toMinutes(SALON_CLOSE)
  const now = Date.now()
  const slots: Slot[] = []
  for (let m = open; m + dur <= close; m += SLOT_STEP_MIN) {
    const time = fromMinutes(m)
    const start = zonedToUtc(input.date, time, STUDIO_TZ).getTime()
    const end = start + dur * 60_000
    const free = staffIds.some((id) => !ranges.some((r) => r.staff_id === id && r.s < end && r.e > start))
    slots.push({ time, label: timeLabel(time), available: start > now && free })
  }
  return { ok: true, slots }
}

export async function bookAppointment(input: {
  serviceId: string; staffId: string | null; date: string; time: string; notes?: string
}): Promise<ActionResult<{ appointmentId: string }>> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'auth' }
  if (!dateInWindow(input.date) || !TIME_RE.test(input.time)) return { ok: false, error: 'Please choose a valid date and time.' }

  const startsAt = zonedToUtc(input.date, input.time, STUDIO_TZ)
  const { data, error } = await supabase.rpc('book_appointment', {
    p_service_id: input.serviceId,
    p_staff_id: input.staffId,
    p_starts_at: startsAt.toISOString(),
    p_notes: input.notes ?? null,
  })
  if (error) return { ok: false, error: friendlyError(error.message) }

  revalidatePath('/dashboard')
  revalidatePath('/admin')
  return { ok: true, appointmentId: data as string }
}

export async function cancelMyAppointment(id: string, _fd?: FormData): Promise<void> {
  const supabase = createClient()
  await supabase.rpc('cancel_my_appointment', { p_id: id })
  revalidatePath('/dashboard')
  revalidatePath('/admin')
}
