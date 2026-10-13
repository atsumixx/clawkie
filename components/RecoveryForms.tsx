'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { requestPasswordReset, updatePassword, type AuthState } from '@/app/actions/auth'
import { NewPasswordFields } from './PasswordFields'

function Submit({ label, disabled }: { label: string; disabled?: boolean }) {
  const { pending } = useFormStatus()
  return <button className="neo-btn-ink w-full" disabled={pending || disabled}>{pending ? 'One moment…' : label}</button>
}

function Messages({ state }: { state: AuthState }) {
  return (
    <>
      {state.error && <p role="alert" className="neo-inset rounded-2xl px-4 py-3 text-body-sm text-danger">{state.error}</p>}
      {state.message && <p role="status" className="neo-inset rounded-2xl px-4 py-3 text-body-sm">{state.message}</p>}
    </>
  )
}

export function ForgotForm() {
  const [state, action] = useFormState<AuthState, FormData>(requestPasswordReset, {})
  return (
    <div className="mx-auto max-w-md">
      <div className="neo-float p-6 md:p-8">
        <h1 className="font-display text-headline-lg-mobile md:text-headline-lg">Reset your password</h1>
        <p className="mt-1 text-body-md text-slate">We’ll email you a secure link to choose a new password.</p>
        <form action={action} className="mt-6 flex flex-col gap-4">
          <div>
            <label className="neo-label" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required autoComplete="email" className="neo-input" />
          </div>
          <Messages state={state} />
          <Submit label="Send reset link" />
        </form>
        <p className="mt-6 text-center text-body-md text-slate">
          Remembered it? <Link className="font-semibold text-ink underline underline-offset-4" href="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export function ResetForm() {
  const [state, action] = useFormState<AuthState, FormData>(updatePassword, {})
  const [ok, setOk] = useState(false)
  return (
    <div className="mx-auto max-w-md">
      <div className="neo-float p-6 md:p-8">
        <h1 className="font-display text-headline-lg-mobile md:text-headline-lg">New password</h1>
        <p className="mt-1 text-body-md text-slate">Pick a strong password you haven’t used before.</p>
        <form action={action} className="mt-6 flex flex-col gap-4">
          <NewPasswordFields passwordLabel="New password" onValid={setOk} />
          <Messages state={state} />
          <Submit label="Update password" disabled={!ok} />
        </form>
      </div>
    </div>
  )
}
