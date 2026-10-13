import { Cookie } from 'lucide-react'

/** Recessed image frame with graceful placeholder */
export default function Thumb({ src, alt, className = 'h-44' }: { src: string | null; alt: string; className?: string }) {
  return (
    <div className={`neo-inset w-full overflow-hidden rounded-2xl p-1.5 ${className}`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} loading="lazy" className="h-full w-full rounded-xl object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-xl text-slate/60"><Cookie size={40} strokeWidth={1.5} /></div>
      )}
    </div>
  )
}
