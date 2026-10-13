'use client'
import Link from 'next/link'
import { useFormState, useFormStatus } from 'react-dom'
import { resendCode, verifyEmail, type AuthState } from '@/app/actions/auth'

function Submit({ label, ink = true }: { label: string; ink?: boolean }) {
  const { pending } = useFormStatus()
  return (
    <button className={`${ink ? 'neo-btn-ink' : 'neo-btn'} w-full ${pending ? 'btn-loading' : ''}`} disabled={pending} aria-busy={pending || undefined}>
      <span className="btn-label">{pending ? 'One moment…' : label}</span>
    </button>
  )
}

export default function VerifyForm({ email, next }: { email: string; next: string }) {
  const [vState, verify] = useFormState<AuthState, FormData>(verifyEmail, {})
  const [rState, resend] = useFormState<AuthState, FormData>(resendCode, {})
  return (
    <div className="mx-auto max-w-md">
      <div className="neo-float p-6 md:p-8">
        <h1 className="font-display text-headline-lg-mobile md:text-headline-lg">Check your email</h1>
        <p className="mt-1 text-body-md text-slate">We sent a verification code to <b className="text-ink">{email}</b>.</p>

        <form action={verify} className="mt-6 flex flex-col gap-4">
          <input type="hidden" name="email" value={email} />
          <input type="hidden" name="next" value={next} />
          <div>
            <label className="neo-label" htmlFor="token">Verification code</label>
            <input id="token" name="token" required inputMode="numeric" autoComplete="one-time-code" pattern="[0-9 ]*" maxLength={12}
              className="neo-input text-center font-display text-headline-md tracking-[0.35em]" placeholder="••••••" />
          </div>
          {vState.error && <p role="alert" className="neo-inset rounded-2xl px-4 py-3 text-body-sm text-danger">{vState.error}</p>}
          <Submit label="Verify and continue" />
        </form>

        <form action={resend} className="mt-4 flex flex-col gap-3">
          <input type="hidden" name="email" value={email} />
          {rState.error && <p role="alert" className="neo-inset rounded-2xl px-4 py-3 text-body-sm text-danger">{rState.error}</p>}
          {rState.message && <p role="status" className="neo-inset rounded-2xl px-4 py-3 text-body-sm">{rState.message}</p>}
          <Submit label="Resend code" ink={false} />
        </form>

        <p className="mt-6 text-center text-body-md text-slate">
          Wrong email? <Link className="font-semibold text-ink underline underline-offset-4" href="/signup">Start over</Link>
        </p>
      </div>
    </div>
  )
}
