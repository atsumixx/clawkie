import { Cookie } from 'lucide-react'

/** Recessed image frame with graceful placeholder */
export default function Thumb({ src, alt, className = 'h-44' }: { src: string | null; alt: string; className?: string }) {
  return (
    <div className={`w-full overflow-hidden rounded-lg border border-ink/10 bg-tan/60 ${className}`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.02]" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-ink/50"><Cookie size={40} strokeWidth={1.5} /></div>
      )}
    </div>
  )
}
