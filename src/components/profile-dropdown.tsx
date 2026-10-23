import { Link } from '@tanstack/react-router'
import { ChevronsUpDown, LogOut, UserRound } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import useDialogState from '@/hooks/use-dialog-state'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarMenuButton, useSidebar } from '@/components/ui/sidebar'
import { SignOutDialog } from '@/components/sign-out-dialog'

export function ProfileDropdown({ sidebar = false }: { sidebar?: boolean }) {
  const [open, setOpen] = useDialogState()
  const { isMobile } = useSidebar()
  const email = useAuthStore(
    (state) => state.auth.user?.email ?? 'user@example.com'
  )
  const avatar = (
    <Avatar className='size-8 shrink-0'>
      <AvatarFallback>
        <UserRound className='size-4' />
      </AvatarFallback>
    </Avatar>
  )

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          {sidebar ? (
            <SidebarMenuButton size='lg' aria-label='Open account menu'>
              {avatar}
              <div className='grid flex-1 text-start text-sm leading-tight'>
                <span className='truncate font-semibold'>Current user</span>
                <span className='truncate text-xs'>{email}</span>
              </div>
              <ChevronsUpDown className='ms-auto size-4' />
            </SidebarMenuButton>
          ) : (
            <Button
              variant='ghost'
              size='icon'
              className='size-8 rounded-full'
              aria-label='Open account menu'
            >
              {avatar}
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className='w-56'
          align='end'
          side={sidebar && !isMobile ? 'right' : 'bottom'}
        >
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col gap-1.5'>
              <p className='text-sm leading-none font-medium'>Current user</p>
              <p className='truncate text-xs leading-none text-muted-foreground'>
                {email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link to='/settings'>Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to='/settings/account'>Account</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to='/settings/notifications'>Notifications</Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant='destructive' onClick={() => setOpen(true)}>
            <LogOut /> Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <SignOutDialog open={!!open} onOpenChange={setOpen} />
    </>
  )
}
