'use client'
import { useEffect, useState } from 'react'
import { Check, Circle, Eye, EyeOff, X } from 'lucide-react'
import { checkPassword } from '@/lib/password'

export function PasswordInput({ id, name, label, autoComplete, value, onChange, describedBy }: {
  id: string; name: string; label: string; autoComplete: string
  value?: string; onChange?: (v: string) => void; describedBy?: string
}) {
  const [show, setShow] = useState(false)
  return (
    <div>
      <label className="neo-label" htmlFor={id}>{label}</label>
      <div className="relative">
        <input id={id} name={name} type={show ? 'text' : 'password'} required autoComplete={autoComplete}
          aria-describedby={describedBy} value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          className="neo-input pr-14" />
        <button type="button" onClick={() => setShow((s) => !s)} aria-pressed={show}
          aria-label={show ? 'Hide password' : 'Show password'}
          className="neo-icon-btn absolute right-2 top-1/2 !h-8 !w-8 -translate-y-1/2">
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  )
}

export function StrengthMeter({ password }: { password: string }) {
  const { score, label, checks } = checkPassword(password)
  const rules = [
    { ok: checks.length, text: '8+ characters' },
    { ok: checks.mixedCase, text: 'Upper & lower case' },
    { ok: checks.number, text: 'A number' },
    { ok: checks.symbol, text: 'A symbol' },
  ]
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="neo-inset flex flex-1 gap-1 rounded-full p-1" aria-hidden="true">
          {[1, 2, 3, 4].map((i) => (
            <span key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= score ? 'bg-ink' : 'bg-slate/20'}`} />
          ))}
        </div>
        <span role="status" className="min-w-16 text-right font-display text-label-md text-slate">{label}</span>
      </div>
      <ul className="flex flex-wrap gap-2">
        {rules.map((r) => (
          <li key={r.text} className={`neo-chip ${r.ok ? '!text-ink' : ''}`}>
            {r.ok ? <Check size={12} /> : <Circle size={12} />} {r.text}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function NewPasswordFields({ onValid, passwordLabel = 'Password' }: {
  onValid?: (ok: boolean) => void; passwordLabel?: string
}) {
  const [pw, setPw] = useState('')
  const [confirm, setConfirm] = useState('')
  const { acceptable } = checkPassword(pw)
  const matches = pw.length > 0 && pw === confirm
  const ok = acceptable && matches

  useEffect(() => { onValid?.(ok) }, [ok, onValid])

  return (
    <>
      <PasswordInput id="password" name="password" label={passwordLabel} autoComplete="new-password" value={pw} onChange={setPw} />
      <StrengthMeter password={pw} />
      <PasswordInput id="confirm" name="confirm" label="Confirm password" autoComplete="new-password"
        value={confirm} onChange={setConfirm} describedBy="match-hint" />
      <p id="match-hint" role="status" className={`-mt-2 flex min-h-5 items-center gap-1.5 px-1 text-body-sm ${matches ? 'text-ink' : 'text-danger'}`}>
        {confirm.length > 0 && (matches
          ? <><Check size={14} /> Passwords match</>
          : <><X size={14} /> Passwords don’t match</>)}
      </p>
    </>
  )
}
