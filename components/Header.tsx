import Link from 'next/link'
import { LogOut, User } from 'lucide-react'
import { BRAND } from '@/lib/config'
import { getSessionProfile } from '@/lib/auth'
import { signOut } from '@/app/actions/auth'
import NavLinks from './NavLinks'
import CartButton from './CartButton'
import BottomNav from './BottomNav'

export default async function Header() {
  const { user, profile } = await getSessionProfile()
  const isAdmin = profile?.role === 'admin'
  return (
    <>
      <header className="pt-safe fixed inset-x-0 top-0 z-40 border-b-2 border-ink bg-canvas/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-gutter md:px-gutter-desktop">
          <Link href="/" aria-label={BRAND} className="flex items-center">
            <span className="font-hand text-[34px] font-bold lowercase leading-none">{BRAND}</span>
          </Link>
          <NavLinks isAdmin={isAdmin} />
          <div className="flex items-center gap-3">
            <CartButton />
            {user ? (
              <form action={signOut}>
                <button className="neo-icon-btn" aria-label="Sign out" title="Sign out"><LogOut size={18} /></button>
              </form>
            ) : (
              <Link href="/login" className="neo-icon-btn" aria-label="Sign in"><User size={18} /></Link>
            )}
          </div>
        </div>
      </header>
      <BottomNav isAdmin={isAdmin} signedIn={!!user} />
    </>
  )
}
