/* Atelier Noir service worker
 * - precaches the offline fallback + icons
 * - cache-first for immutable build assets and static files
 * - navigations: network only, falling back to the offline page when there is no connection
 * - HTML is never cached, so no signed-in / private page content is ever stored
 */
const VERSION = 'v1'
const STATIC_CACHE = `an-static-${VERSION}`
const PRECACHE = ['/offline.html', '/icons/icon-192.png', '/icons/icon-512.png']

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(STATIC_CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== STATIC_CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return // Supabase, fonts CDN, etc.

  // Immutable Next.js assets & icons: cache-first
  if (url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/icons/')) {
    event.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        const copy = res.clone(); caches.open(STATIC_CACHE).then((c) => c.put(req, copy)); return res
      })),
    )
    return
  }

  // Page navigations
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).catch(() => caches.match('/offline.html')))
  }
})
