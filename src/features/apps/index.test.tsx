import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router'
import { Route as AppsRoute } from '@/routes/_authenticated/apps'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { page } from 'vitest/browser'
import { ThemeProvider } from '@/context/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { Apps } from '.'
import { apps } from './data/apps'

async function renderApps(initialEntry = '/apps') {
  const rootRoute = createRootRoute({
    component: () => (
      <ThemeProvider>
        <Outlet />
        <Toaster />
      </ThemeProvider>
    ),
  })
  const authenticatedRoute = createRoute({
    getParentRoute: () => rootRoute,
    id: '_authenticated',
    component: Outlet,
  })
  const appsRoute = createRoute({
    getParentRoute: () => authenticatedRoute,
    path: '/apps/',
    validateSearch: AppsRoute.options.validateSearch,
    component: Apps,
  })
  const router = createRouter({
    routeTree: rootRoute.addChildren([
      authenticatedRoute.addChildren([appsRoute]),
    ]),
    history: createMemoryHistory({ initialEntries: [initialEntry] }),
  })
  await router.load()
  await render(<RouterProvider router={router} />)
  await expect
    .element(page.getByRole('heading', { name: '应用集成', exact: true }))
    .toBeVisible()
  return router
}

function appNames() {
  return page
    .getByRole('heading', { level: 2 })
    .all()
    .map((heading) => heading.element().textContent)
}

describe('应用集成页面', () => {
  it('restores all 15 apps with Chinese descriptions and connection states', async () => {
    await renderApps()

    expect(appNames()).toHaveLength(15)
    expect(appNames()[0]).toBe('Discord')
    expect(appNames().slice(-1)[0]).toBe('Zoom')
    await expect
      .element(page.getByText('查看并管理可集成的应用。'))
      .toBeVisible()
    await expect
      .element(page.getByText('集成 GitHub，让代码管理更便捷。'))
      .toBeVisible()
    await expect
      .element(page.getByRole('button', { name: '已连接 Notion', exact: true }))
      .toBeDisabled()
    await expect
      .element(page.getByRole('button', { name: '连接 GitHub', exact: true }))
      .toBeEnabled()
  })

  it.each([
    ['gItHuB', ['GitHub']],
    [' 邮件 ', ['Gmail']],
  ] as const)(
    'filters app names and Chinese descriptions with %s',
    async (query, names) => {
      const router = await renderApps()
      await page.getByRole('textbox', { name: '搜索应用' }).fill(query)

      await expect.poll(appNames).toEqual(names)
      expect(router.state.location.search.filter).toBe(query)
    }
  )

  it('filters by connection status and combines the filter with search', async () => {
    const router = await renderApps()
    await page.getByRole('combobox', { name: '连接状态' }).click()
    await page.getByRole('option', { name: '已连接', exact: true }).click()

    await expect.poll(appNames).toEqual(['Figma', 'Gmail', 'Notion', 'Zoom'])
    expect(router.state.location.search.type).toBe('connected')

    await page.getByRole('textbox', { name: '搜索应用' }).fill('figma')
    await expect.poll(appNames).toEqual(['Figma'])

    await page.getByRole('combobox', { name: '连接状态' }).click()
    await page.getByRole('option', { name: '未连接', exact: true }).click()
    await expect
      .element(page.getByRole('status'))
      .toHaveTextContent('未找到匹配的应用')

    await page.getByRole('textbox', { name: '搜索应用' }).fill('')
    await expect.poll(() => appNames().length).toBe(11)
  })

  it('sorts descending without mutating the shared app data', async () => {
    const originalOrder = apps.map((app) => app.name)
    const router = await renderApps()
    await page.getByRole('combobox', { name: '排序方式' }).click()
    await page.getByRole('option', { name: '名称降序', exact: true }).click()

    await expect.poll(() => appNames()[0]).toBe('Zoom')
    expect(appNames().slice(-1)[0]).toBe('Discord')
    expect(router.state.location.search.sort).toBe('desc')
    expect(apps.map((app) => app.name)).toEqual(originalOrder)
  })

  it('restores filters and sorting from the URL and browser history', async () => {
    const router = await renderApps('/apps?type=connected&filter=o&sort=desc')
    expect(appNames()).toEqual(['Zoom', 'Notion'])
    await expect
      .element(page.getByRole('textbox', { name: '搜索应用' }))
      .toHaveValue('o')

    await page.getByRole('combobox', { name: '连接状态' }).click()
    await page.getByRole('option', { name: '未连接', exact: true }).click()
    await expect
      .poll(() => router.state.location.search.type)
      .toBe('notConnected')
    expect(appNames()).not.toContain('Notion')

    router.history.back()
    await expect.poll(appNames).toEqual(['Zoom', 'Notion'])
    await expect
      .element(page.getByRole('combobox', { name: '连接状态' }))
      .toHaveTextContent('已连接')
  })

  it('falls back to defaults for invalid URL parameters', async () => {
    await renderApps('/apps?type=invalid&sort=invalid&filter=%5B%5D')
    await expect
      .element(page.getByRole('combobox', { name: '连接状态' }))
      .toHaveTextContent('全部应用')
    await expect
      .element(page.getByRole('combobox', { name: '排序方式' }))
      .toHaveAttribute('title', '名称升序')
    await expect
      .element(page.getByRole('textbox', { name: '搜索应用' }))
      .toHaveValue('')
    expect(appNames()).toHaveLength(15)
  })

  it.each(['123', 'true'])(
    'preserves the literal search term %s when opening a URL directly',
    async (filter) => {
      await renderApps(`/apps?filter=${filter}`)

      await expect
        .element(page.getByRole('textbox', { name: '搜索应用' }))
        .toHaveValue(filter)
      await expect
        .element(page.getByRole('status'))
        .toHaveTextContent('未找到匹配的应用')
    }
  )

  it('explains that the example does not connect to a live service', async () => {
    await renderApps('/apps?filter=GitHub')
    await page.getByRole('button', { name: '连接 GitHub', exact: true }).click()

    await expect
      .element(page.getByText('GitHub 连接功能暂未开放，敬请期待。'))
      .toBeVisible()
    await expect
      .element(page.getByRole('button', { name: '连接 GitHub', exact: true }))
      .toBeEnabled()
  })
})
