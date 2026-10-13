'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { login, signup, type AuthState } from '@/app/actions/auth'
import { NewPasswordFields, PasswordInput } from './PasswordFields'

function Submit({ label, disabled }: { label: string; disabled?: boolean }) {
  const { pending } = useFormStatus()
  return <button className="neo-btn-ink w-full" disabled={pending || disabled}>{pending ? 'One moment…' : label}</button>
}

export default function AuthForm({ mode, next }: { mode: 'login' | 'signup'; next: string }) {
  const [state, action] = useFormState<AuthState, FormData>(mode === 'login' ? login : signup, {})
  const [pwOk, setPwOk] = useState(false)
  const isLogin = mode === 'login'
  const q = next && next !== '/dashboard' ? `?next=${encodeURIComponent(next)}` : ''
  return (
    <div className="mx-auto max-w-md">
      <div className="neo-float p-6 md:p-8">
        <h1 className="font-display text-headline-lg-mobile md:text-headline-lg">{isLogin ? 'Welcome back' : 'Create your account'}</h1>
        <p className="mt-1 text-body-md text-slate">{isLogin ? 'Sign in to track orders and manage appointments.' : 'Order bakes and book the studio with one account.'}</p>

        <form action={action} className="mt-6 flex flex-col gap-4">
          <input type="hidden" name="next" value={next} />
          {!isLogin && (
            <div><label className="neo-label" htmlFor="full_name">Full name</label>
              <input id="full_name" name="full_name" required autoComplete="name" className="neo-input" /></div>
          )}
          <div><label className="neo-label" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required autoComplete="email" className="neo-input" /></div>
          {isLogin ? (
            <div>
              <PasswordInput id="password" name="password" label="Password" autoComplete="current-password" />
              <Link href="/forgot-password" className="mt-2 block px-1 text-right text-body-sm text-slate underline underline-offset-4">
                Forgot password?
              </Link>
            </div>
          ) : (
            <NewPasswordFields onValid={setPwOk} />
          )}

          {state.error && <p role="alert" className="neo-inset rounded-2xl px-4 py-3 text-body-sm text-danger">{state.error}</p>}
          {state.message && <p role="status" className="neo-inset rounded-2xl px-4 py-3 text-body-sm">{state.message}</p>}
          <Submit label={isLogin ? 'Sign in' : 'Create account'} disabled={!isLogin && !pwOk} />
        </form>

        <p className="mt-6 text-center text-body-md text-slate">
          {isLogin ? 'New here? ' : 'Already registered? '}
          <Link className="font-semibold text-ink underline underline-offset-4" href={`${isLogin ? '/signup' : '/login'}${q}`}>
            {isLogin ? 'Create an account' : 'Sign in'}
          </Link>
        </p>
      </div>
    </div>
  )
}
