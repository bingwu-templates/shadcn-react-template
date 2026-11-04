import { getRouteApi } from '@tanstack/react-router'
import { ArrowDownAZ, ArrowUpAZ, SlidersHorizontal } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Main } from '@/components/layout/main'
import { apps } from './data/apps'

const route = getRouteApi('/_authenticated/apps/')

export function Apps() {
  const { filter = '', type = 'all', sort = 'asc' } = route.useSearch()
  const navigate = route.useNavigate()
  const searchTerm = filter.trim().toLowerCase()

  const filteredApps = apps
    .filter((app) => {
      const matchesType =
        type === 'connected'
          ? app.connected
          : type === 'notConnected'
            ? !app.connected
            : true

      return (
        matchesType &&
        `${app.name} ${app.desc}`.toLowerCase().includes(searchTerm)
      )
    })
    .sort((a, b) =>
      sort === 'asc'
        ? a.name.localeCompare(b.name, 'en')
        : b.name.localeCompare(a.name, 'en')
    )

  return (
    <Main fixed>
      <div className='shrink-0'>
        <h1 className='text-2xl font-bold tracking-tight'>应用集成</h1>
        <p className='text-muted-foreground'>查看并管理可集成的应用。</p>
      </div>
      <div className='my-4 flex shrink-0 items-end justify-between gap-4 sm:items-center'>
        <div className='flex min-w-0 flex-col gap-4 sm:flex-row'>
          <Input
            aria-label='搜索应用'
            placeholder='搜索应用...'
            className='h-9 w-40 lg:w-62.5'
            value={filter}
            onChange={(event) => {
              const value = event.target.value
              navigate({
                search: (prev) => ({ ...prev, filter: value || undefined }),
                replace: true,
              })
            }}
          />
          <Select
            value={type}
            onValueChange={(value: 'all' | 'connected' | 'notConnected') =>
              navigate({
                search: (prev) => ({
                  ...prev,
                  type: value === 'all' ? undefined : value,
                }),
              })
            }
          >
            <SelectTrigger aria-label='连接状态' className='w-36'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>全部应用</SelectItem>
              <SelectItem value='connected'>已连接</SelectItem>
              <SelectItem value='notConnected'>未连接</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Select
          value={sort}
          onValueChange={(value: 'asc' | 'desc') =>
            navigate({ search: (prev) => ({ ...prev, sort: value }) })
          }
        >
          <SelectTrigger
            aria-label='排序方式'
            title={sort === 'asc' ? '名称升序' : '名称降序'}
            className='w-16'
          >
            <SelectValue>
              <SlidersHorizontal aria-hidden='true' size={18} />
            </SelectValue>
          </SelectTrigger>
          <SelectContent align='end'>
            <SelectItem value='asc'>
              <ArrowUpAZ aria-hidden='true' size={16} />
              <span>名称升序</span>
            </SelectItem>
            <SelectItem value='desc'>
              <ArrowDownAZ aria-hidden='true' size={16} />
              <span>名称降序</span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Separator className='shrink-0 shadow-sm' />
      {filteredApps.length > 0 ? (
        <ul
          aria-label='应用列表'
          className='faded-bottom no-scrollbar grid min-h-0 flex-1 content-start gap-4 overflow-auto pt-4 pb-16 md:grid-cols-2 lg:grid-cols-3'
        >
          {filteredApps.map((app) => (
            <li
              key={app.name}
              className='rounded-lg border p-4 hover:shadow-md'
            >
              <div className='mb-8 flex items-center justify-between'>
                <div className='flex size-10 items-center justify-center rounded-lg bg-muted p-2'>
                  {app.logo}
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  disabled={app.connected}
                  aria-label={`${app.connected ? '已连接' : '连接'} ${app.name}`}
                  className={cn(
                    app.connected &&
                      'border-blue-300 bg-blue-50 hover:bg-blue-100 disabled:opacity-100 dark:border-blue-700 dark:bg-blue-950 dark:hover:bg-blue-900'
                  )}
                  onClick={() =>
                    toast.info(`${app.name} 连接功能暂未开放，敬请期待。`)
                  }
                >
                  {app.connected ? '已连接' : '连接'}
                </Button>
              </div>
              <h2 className='mb-1 font-semibold'>{app.name}</h2>
              <p className='line-clamp-2 text-muted-foreground'>{app.desc}</p>
            </li>
          ))}
        </ul>
      ) : (
        <div
          role='status'
          className='flex flex-1 flex-col items-center justify-center gap-2 py-16 text-center'
        >
          <p className='font-medium'>未找到匹配的应用</p>
          <p className='text-sm text-muted-foreground'>
            请尝试其他关键词或连接状态。
          </p>
        </div>
      )}
    </Main>
  )
}
