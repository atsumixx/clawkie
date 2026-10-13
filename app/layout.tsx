import type { Metadata, Viewport } from 'next'
import { Fredoka, Gaegu, Nunito } from 'next/font/google'
import './globals.css'
import { BRAND } from '@/lib/config'
import { CartProvider } from '@/components/CartProvider'
import Header from '@/components/Header'
import RegisterSW from '@/components/RegisterSW'

const display = Fredoka({ subsets: ['latin'], variable: '--font-display', display: 'swap' })
const body = Nunito({ subsets: ['latin'], variable: '--font-body', display: 'swap' })
const hand = Gaegu({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-hand', display: 'swap' })

export const metadata: Metadata = {
  title: { default: `${BRAND} — Bakery & Nail Studio`, template: `%s · ${BRAND}` },
  description: 'Fresh bakes and nail art, ordered and booked in one place.',
  applicationName: BRAND,
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, title: BRAND, statusBarStyle: 'default' },
  icons: { icon: '/icons/icon-192.png', apple: '/icons/apple-touch-icon.png' },
}

export const viewport: Viewport = {
  themeColor: '#F6F4EF',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${hand.variable}`}>
      <body className="min-h-screen">
        <CartProvider>
          <Header />
          <main className="mx-auto w-full max-w-[1200px] px-gutter pb-32 pt-24 md:px-gutter-desktop md:pb-16">{children}</main>
        </CartProvider>
        <RegisterSW />
      </body>
    </html>
  )
}
