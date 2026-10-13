import { createClient } from '@/lib/supabase/server'
import { getSessionProfile } from '@/lib/auth'
import { BOOKING_WINDOW_DAYS, STUDIO_TZ } from '@/lib/config'
import { addDays, dayParts, todayIn } from '@/lib/time'
import ServiceSwitcher from '@/components/ServiceSwitcher'
import SalonBooking from '@/components/SalonBooking'
import type { Service, Staff } from '@/lib/types'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Nail Studio' }

export default async function SalonPage() {
  const supabase = createClient()
  const { user } = await getSessionProfile()
  const [{ data: services }, { data: staff }] = await Promise.all([
    supabase.from('services').select('*').eq('is_available', true).order('price'),
    supabase.from('staff').select('*').eq('is_active', true).order('sort_order'),
  ])

  const today = todayIn(STUDIO_TZ)
  const days = Array.from({ length: BOOKING_WINDOW_DAYS + 1 }, (_, i) => {
    const date = addDays(today, i)
    const p = dayParts(date)
    return { date, weekday: p.weekday, day: p.day, long: p.long }
  })

  return (
    <div className="flex flex-col gap-6">
      <ServiceSwitcher />
      <header>
        <h1 className="font-display text-headline-lg-mobile md:text-headline-lg">Book the studio</h1>
        <p className="text-body-md text-slate">Pick a service and a time. Times shown in studio local time.</p>
      </header>
      <SalonBooking services={(services ?? []) as Service[]} staff={(staff ?? []) as Staff[]} days={days} signedIn={!!user} />
    </div>
  )
}
