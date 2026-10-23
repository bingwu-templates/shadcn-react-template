import { type ImgHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import logoUrl from './logo.png'

export function Logo({
  className,
  alt = 'Admin Workspace',
  ...props
}: Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'>) {
  return (
    <img
      src={logoUrl}
      alt={alt}
      width={32}
      height={32}
      className={cn('size-8 shrink-0 rounded-lg object-contain', className)}
      {...props}
    />
  )
}
