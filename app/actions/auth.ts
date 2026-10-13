'use server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
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
  if (error) return { error: error.message === 'Email not confirmed' ? 'Please confirm your email first.' : 'Invalid email or password.' }
  redirect(safeNext(fd.get('next')))
}

export async function signup(_prev: AuthState, fd: FormData): Promise<AuthState> {
  const email = String(fd.get('email') ?? '').trim()
  const password = String(fd.get('password') ?? '')
  const fullName = String(fd.get('full_name') ?? '').trim()
  if (!fullName) return { error: 'Please enter your name.' }
  if (!email) return { error: 'Please enter your email.' }
  if (password.length < 8) return { error: 'Password must be at least 8 characters.' }

  const origin = process.env.NEXT_PUBLIC_SITE_URL || headers().get('origin') || 'http://localhost:3000'
  const supabase = createClient()
  const { data, error } = await supabase.auth.signUp({
    email, password,
    options: { data: { full_name: fullName }, emailRedirectTo: `${origin}/auth/callback` },
  })
  if (error) return { error: error.message }
  if (data.session) redirect(safeNext(fd.get('next')))
  return { message: 'Check your inbox to confirm your email, then sign in.' }
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/')
}
