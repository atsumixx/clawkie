import { redirect } from 'next/navigation'
import VerifyForm from '@/components/VerifyForm'

export const metadata = { title: 'Verify email' }

export default function VerifyPage({ searchParams }: { searchParams: { email?: string; next?: string } }) {
  const email = searchParams.email?.trim()
  if (!email) redirect('/signup')
  const n = searchParams.next ?? '/dashboard'
  const next = n.startsWith('/') && !n.startsWith('//') ? n : '/dashboard'
  return <VerifyForm email={email} next={next} />
}
