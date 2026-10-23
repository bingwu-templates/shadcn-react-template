import { type SVGProps } from 'react'
import { cn } from '@/lib/utils'

export function Logo({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox='0 0 24 24'
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={cn('size-6', className)}
      {...props}
    >
      <title>Admin Workspace</title>
      <rect x='3' y='3' width='7' height='18' rx='2' />
      <rect x='14' y='3' width='7' height='7' rx='2' />
      <rect x='14' y='14' width='7' height='7' rx='2' />
    </svg>
  )
}
