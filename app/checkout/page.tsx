import { requireUser } from '@/lib/auth'
import CheckoutForm from '@/components/CheckoutForm'

export const metadata = { title: 'Checkout' }

export default async function CheckoutPage() {
  const { profile } = await requireUser('/checkout')
  return <CheckoutForm defaultName={profile?.full_name ?? ''} defaultPhone={profile?.phone ?? ''} />
}
