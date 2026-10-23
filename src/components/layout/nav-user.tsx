import { SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar'
import { ProfileDropdown } from '@/components/profile-dropdown'

export function NavUser() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <ProfileDropdown sidebar />
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
