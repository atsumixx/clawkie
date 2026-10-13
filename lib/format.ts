import { CURRENCY, STUDIO_TZ } from './config'

const moneyFmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: CURRENCY })
export const money = (n: number | string) => moneyFmt.format(Number(n))

export const dateTime = (iso: string) =>
  new Intl.DateTimeFormat('en-US', {
    timeZone: STUDIO_TZ, weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  }).format(new Date(iso))

export const shortDate = (iso: string) =>
  new Intl.DateTimeFormat('en-US', { timeZone: STUDIO_TZ, month: 'short', day: 'numeric' }).format(new Date(iso))

export const timeOnly = (iso: string) =>
  new Intl.DateTimeFormat('en-US', { timeZone: STUDIO_TZ, hour: 'numeric', minute: '2-digit' }).format(new Date(iso))

export const orderRef = (n: number) => `#BK-${String(n).padStart(4, '0')}`

export const statusLabel: Record<string, string> = {
  pending: 'Pending',
  baking: 'Baking',
  out_for_delivery: 'Out for delivery',
  completed: 'Completed',
  cancelled: 'Cancelled',
  confirmed: 'Confirmed',
}
