import AuthForm from '@/components/AuthForm'

export const metadata = { title: 'Sign in' }

export default function LoginPage({ searchParams }: { searchParams: { next?: string; error?: string } }) {
  return (
    <>
      {searchParams.error === 'confirm' && (
        <p role="alert" className="neo-inset mx-auto mb-4 max-w-md rounded-2xl px-4 py-3 text-body-sm text-danger">
          That confirmation link didn’t work. Try signing in, or sign up again.
        </p>
      )}
      <AuthForm mode="login" next={searchParams.next ?? '/dashboard'} />
    </>
  )
}
