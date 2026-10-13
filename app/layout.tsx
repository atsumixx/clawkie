import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { BRAND } from '@/lib/config'
import { CartProvider } from '@/components/CartProvider'
import Header from '@/components/Header'
import RegisterSW from '@/components/RegisterSW'

const sans = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: `${BRAND} — Bakery & Nail Studio`, template: `%s · ${BRAND}` },
  description: 'Fresh bakes and nail art, ordered and booked in one place.',
  applicationName: BRAND,
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, title: BRAND, statusBarStyle: 'default' },
  icons: { icon: '/icons/icon-192.png', apple: '/icons/apple-touch-icon.png' },
}

export const viewport: Viewport = {
  themeColor: '#FBF6EF',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sans.variable}>
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
