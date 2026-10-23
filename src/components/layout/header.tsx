import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'

export function Header({
  className,
  children,
  ...props
}: React.ComponentProps<'header'>) {
  return (
    <header
      className={cn(
        'sticky top-0 z-30 h-16 shrink-0 border-b bg-background/95 backdrop-blur-sm',
        className
      )}
      {...props}
    >
      <div className='flex h-full items-center gap-3 p-4 sm:gap-4'>
        <SidebarTrigger variant='outline' className='max-md:scale-125' />
        <Separator orientation='vertical' className='h-6' />
        {children}
      </div>
    </header>
  )
}
