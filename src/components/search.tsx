import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  ArrowRight,
  ChevronRight,
  Laptop,
  Moon,
  SearchIcon,
  Sun,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/context/theme-provider'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { sidebarData } from '@/components/layout/data/sidebar-data'

export function Search({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { setTheme } = useTheme()
  const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() === 'k' &&
        (event.metaKey || event.ctrlKey) &&
        !event.altKey &&
        !event.isComposing &&
        !event.repeat
      ) {
        event.preventDefault()
        setOpen((current) => !current)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  function runCommand(command: () => unknown) {
    setOpen(false)
    command()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type='button'
          variant='outline'
          className={cn(
            'min-w-0 flex-1 justify-start bg-muted/25 font-normal text-muted-foreground shadow-none sm:max-w-64',
            className
          )}
          aria-label='搜索菜单'
          aria-keyshortcuts='Meta+K Control+K'
        >
          <SearchIcon aria-hidden='true' />
          <span className='truncate'>搜索菜单...</span>
          <kbd className='pointer-events-none ms-auto hidden items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs sm:inline-flex'>
            {isMac ? '⌘' : 'Ctrl'} K
          </kbd>
        </Button>
      </DialogTrigger>
      <DialogContent className='gap-0 overflow-hidden p-0'>
        <DialogTitle className='sr-only'>搜索菜单</DialogTitle>
        <DialogDescription className='sr-only'>
          输入菜单名称或路径，使用方向键选择，按回车跳转。
        </DialogDescription>
        <Command
          label='搜索菜单'
          className='**:data-[slot=command-input-wrapper]:h-12 **:data-[slot=command-input-wrapper]:pe-12'
        >
          <CommandInput placeholder='搜索菜单名称或路径...' />
          <CommandList className='max-h-[min(24rem,60svh)]'>
            <CommandEmpty>未找到匹配的菜单或命令。</CommandEmpty>
            {sidebarData.navGroups.map((group) => (
              <CommandGroup key={group.title} heading={group.title}>
                {group.items.map((item) => {
                  if (item.items) {
                    return item.items.map((subItem) => {
                      const Icon = subItem.icon ?? item.icon ?? ArrowRight

                      return (
                        <CommandItem
                          key={subItem.url}
                          aria-label={`${item.title} ${subItem.title}`}
                          value={`${item.title} ${subItem.title} ${subItem.url}`}
                          keywords={[group.title]}
                          onSelect={() =>
                            runCommand(() => navigate({ to: subItem.url }))
                          }
                        >
                          <Icon aria-hidden='true' />
                          <span className='text-muted-foreground'>
                            {item.title}
                          </span>
                          <ChevronRight aria-hidden='true' />
                          <span>{subItem.title}</span>
                        </CommandItem>
                      )
                    })
                  }

                  const Icon = item.icon ?? ArrowRight

                  return (
                    <CommandItem
                      key={item.url}
                      value={`${item.title} ${item.url}`}
                      keywords={[group.title]}
                      onSelect={() =>
                        runCommand(() => navigate({ to: item.url }))
                      }
                    >
                      <Icon aria-hidden='true' />
                      <span>{item.title}</span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            ))}
            <CommandSeparator />
            <CommandGroup heading='主题'>
              <CommandItem onSelect={() => runCommand(() => setTheme('light'))}>
                <Sun aria-hidden='true' />
                <span>浅色</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => setTheme('dark'))}>
                <Moon aria-hidden='true' />
                <span>深色</span>
              </CommandItem>
              <CommandItem
                onSelect={() => runCommand(() => setTheme('system'))}
              >
                <Laptop aria-hidden='true' />
                <span>跟随系统</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
