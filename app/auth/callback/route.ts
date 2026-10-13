import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Exchanges email confirmation and password recovery links for a session.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') || '/dashboard'
  const destination = next.startsWith('/') && !next.startsWith('//') && !next.includes('\\')
    ? next
    : '/dashboard'
  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(new URL(destination, origin))
  }
  return NextResponse.redirect(`${origin}/login?error=confirm`)
}
