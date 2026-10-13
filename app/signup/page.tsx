import AuthForm from '@/components/AuthForm'

export const metadata = { title: 'Create account' }

export default function SignupPage({ searchParams }: { searchParams: { next?: string } }) {
  return <AuthForm mode="signup" next={searchParams.next ?? '/dashboard'} />
}
