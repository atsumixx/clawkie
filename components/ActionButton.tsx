'use client'
import { useFormStatus } from 'react-dom'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export default function ActionButton({ children, className = '', disabled, type = 'submit', ...props }: ActionButtonProps) {
  const { pending } = useFormStatus()
  return (
    <button {...props} type={type} disabled={pending || disabled} aria-busy={pending || undefined}
      className={`${className} ${pending ? 'btn-loading' : ''}`}>
      <span className="btn-label">{children}</span>
    </button>
  )
}
