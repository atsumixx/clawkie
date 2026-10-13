'use server'
import { redirect } from 'next/navigation'
import { checkPassword, PASSWORD_RULE_TEXT } from '@/lib/password'
import { createClient } from '@/lib/supabase/server'

export interface AuthState { error?: string; message?: string }

function safeNext(v: FormDataEntryValue | null): string {
  const s = typeof v === 'string' ? v : ''
  return s.startsWith('/') && !s.startsWith('//') ? s : '/dashboard'
}

export async function login(_prev: AuthState, fd: FormData): Promise<AuthState> {
  const email = String(fd.get('email') ?? '').trim()
  const password = String(fd.get('password') ?? '')
  if (!email || !password) return { error: 'Enter your email and password.' }

  const supabase = createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    if (error.message === 'Email not confirmed') {
      redirect(`/verify?email=${encodeURIComponent(email)}&next=${encodeURIComponent(safeNext(fd.get('next')))}`)
    }
    return { error: 'Invalid email or password.' }
  }
  redirect(safeNext(fd.get('next')))
}

export async function signup(_prev: AuthState, fd: FormData): Promise<AuthState> {
  const email = String(fd.get('email') ?? '').trim()
  const password = String(fd.get('password') ?? '')
  const fullName = String(fd.get('full_name') ?? '').trim()
  if (!fullName) return { error: 'Please enter your name.' }
  if (!email) return { error: 'Please enter your email.' }
  const confirm = String(fd.get('confirm') ?? '')
  if (!checkPassword(password).acceptable) return { error: `Password is too weak. ${PASSWORD_RULE_TEXT}` }
  if (password !== confirm) return { error: 'Passwords don’t match.' }

  const supabase = createClient()
  const { data, error } = await supabase.auth.signUp({
    email, password,
    options: { data: { full_name: fullName } },
  })
  if (error) return { error: error.message }
  const next = safeNext(fd.get('next'))
  if (data.session) redirect(next)
  redirect(`/verify?email=${encodeURIComponent(email)}&next=${encodeURIComponent(next)}`)
}

export async function requestPasswordReset(_prev: AuthState, fd: FormData): Promise<AuthState> {
  const email = String(fd.get('email') ?? '').trim()
  if (!email) return { error: 'Enter your email address.' }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const supabase = createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?next=${encodeURIComponent('/reset-password')}`,
  })
  if (error) return { error: 'Could not send a reset link. Try again shortly.' }
  return { message: 'If an account exists for that email, a password reset link is on its way.' }
}

export async function updatePassword(_prev: AuthState, fd: FormData): Promise<AuthState> {
  const password = String(fd.get('password') ?? '')
  const confirm = String(fd.get('confirm') ?? '')
  if (!checkPassword(password).acceptable) return { error: `Password is too weak. ${PASSWORD_RULE_TEXT}` }
  if (password !== confirm) return { error: 'Passwords don’t match.' }

  const supabase = createClient()
  const { error } = await supabase.auth.updateUser({ password })
  if (error) return { error: 'Could not update your password. The reset link may have expired.' }
  redirect('/login?password=updated')
}

export async function verifyEmail(_prev: AuthState, fd: FormData): Promise<AuthState> {
  const email = String(fd.get('email') ?? '').trim()
  const token = String(fd.get('token') ?? '').replace(/\s/g, '')
  if (!email) return { error: 'Missing email. Please sign up again.' }
  if (!/^\d{6,10}$/.test(token)) return { error: 'Enter the code from your email.' }

  const supabase = createClient()
  const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' })
  if (error) return { error: 'That code is invalid or has expired.' }
  redirect(safeNext(fd.get('next')))
}

export async function resendCode(_prev: AuthState, fd: FormData): Promise<AuthState> {
  const email = String(fd.get('email') ?? '').trim()
  if (!email) return { error: 'Missing email.' }
  const supabase = createClient()
  const { error } = await supabase.auth.resend({ type: 'signup', email })
  if (error) {
    return { error: /second|rate/i.test(error.message) ? 'Please wait a minute before requesting another code.' : 'Could not resend. Try again shortly.' }
  }
  return { message: 'A new code is on its way.' }
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/')
}
