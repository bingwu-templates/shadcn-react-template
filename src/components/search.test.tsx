import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router'
import { clearCookies } from '@/test-utils/cookies'
import { beforeEach, describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { page, userEvent } from 'vitest/browser'
import { getCookie } from '@/lib/cookies'
import { ThemeProvider } from '@/context/theme-provider'
import { Search } from './search'

async function renderSearch() {
  const rootRoute = createRootRoute({
    component: () => (
      <ThemeProvider>
        <Search />
        <Outlet />
      </ThemeProvider>
    ),
  })
  const routes = [
    createRoute({
      getParentRoute: () => rootRoute,
      path: '/',
      component: () => <h1>首页</h1>,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: '/tasks',
      component: () => <h1>任务页面</h1>,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: '/apps',
      component: () => <h1>应用集成页面</h1>,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: '/settings/account',
      component: () => <h1>账户页面</h1>,
    }),
  ]
  const router = createRouter({
    routeTree: rootRoute.addChildren(routes),
    history: createMemoryHistory({ initialEntries: ['/'] }),
  })
  await router.load()
  await render(<RouterProvider router={router} />)
  await expect
    .element(page.getByRole('button', { name: '搜索菜单' }))
    .toBeInTheDocument()
  return router
}

async function openSearch() {
  await page.getByRole('button', { name: '搜索菜单' }).click()
  await expect
    .element(page.getByPlaceholder('搜索菜单名称或路径...'))
    .toHaveFocus()
  await expect
    .element(page.getByRole('combobox'))
    .toHaveAccessibleName('搜索菜单')
}

describe('Menu search', () => {
  beforeEach(() => {
    clearCookies()
  })

  it('opens from the header button and includes top-level and nested menus', async () => {
    await renderSearch()
    await expect
      .element(page.getByRole('dialog', { name: '搜索菜单' }))
      .not.toBeInTheDocument()

    await openSearch()

    await expect
      .element(page.getByRole('dialog', { name: '搜索菜单' }))
      .toBeInTheDocument()
    await expect
      .element(page.getByRole('option', { name: '仪表盘', exact: true }))
      .toBeVisible()
    await expect
      .element(page.getByRole('option', { name: '设置 账户', exact: true }))
      .toBeVisible()
    await expect
      .element(
        page.getByRole('option', { name: '身份验证 验证码', exact: true })
      )
      .toBeVisible()
  })

  it('filters Chinese menu names, navigates on click, and closes the dialog', async () => {
    const router = await renderSearch()
    await openSearch()
    await page.getByRole('combobox').fill('任务')

    await expect
      .element(page.getByRole('option', { name: '用户管理', exact: true }))
      .not.toBeInTheDocument()
    await page.getByRole('option', { name: '任务管理', exact: true }).click()

    await expect.poll(() => router.state.location.pathname).toBe('/tasks')
    await expect
      .element(page.getByRole('heading', { name: '任务页面' }))
      .toBeVisible()
    await expect.element(page.getByRole('dialog')).not.toBeInTheDocument()
    await expect
      .element(page.getByRole('button', { name: '搜索菜单' }))
      .toHaveFocus()
  })

  it('finds the restored apps page from the Chinese menu search', async () => {
    const router = await renderSearch()
    await openSearch()
    await page.getByRole('combobox').fill('应用集成')
    await page.getByRole('option', { name: '应用集成', exact: true }).click()

    await expect.poll(() => router.state.location.pathname).toBe('/apps')
    await expect
      .element(page.getByRole('heading', { name: '应用集成页面' }))
      .toBeVisible()
    await expect.element(page.getByRole('dialog')).not.toBeInTheDocument()
  })

  it.each(['账户', '/settings/account'])(
    'finds a nested menu by %s and navigates with Enter',
    async (query) => {
      const router = await renderSearch()
      await openSearch()
      await page.getByRole('combobox').fill(query)

      await expect
        .element(page.getByRole('option', { name: '设置 账户', exact: true }))
        .toBeVisible()
      await userEvent.keyboard('{Enter}')

      await expect
        .poll(() => router.state.location.pathname)
        .toBe('/settings/account')
      await expect
        .element(page.getByRole('heading', { name: '账户页面' }))
        .toBeVisible()
      await expect.element(page.getByRole('dialog')).not.toBeInTheDocument()
    }
  )

  it('finds child menus by their parent name and supports arrow-key selection', async () => {
    const router = await renderSearch()
    await openSearch()
    await page.getByRole('combobox').fill('设置')

    await expect
      .element(page.getByRole('option', { name: '设置 个人资料', exact: true }))
      .toHaveAttribute('data-selected', 'true')
    await userEvent.keyboard('{ArrowDown}')
    await expect
      .element(page.getByRole('option', { name: '设置 账户', exact: true }))
      .toHaveAttribute('data-selected', 'true')
    await userEvent.keyboard('{Enter}')

    await expect
      .poll(() => router.state.location.pathname)
      .toBe('/settings/account')
  })

  it.each(['Control', 'Meta'])(
    'toggles with %s+K and closes with Escape',
    async (modifier) => {
      await renderSearch()
      await userEvent.keyboard(`{${modifier}>}k{/${modifier}}`)
      await expect.element(page.getByRole('combobox')).toHaveFocus()

      await userEvent.keyboard(`{${modifier}>}k{/${modifier}}`)
      await expect.element(page.getByRole('dialog')).not.toBeInTheDocument()

      await userEvent.keyboard(`{${modifier}>}k{/${modifier}}`)
      await expect.element(page.getByRole('combobox')).toHaveFocus()
      await userEvent.keyboard('{Escape}')

      await expect.element(page.getByRole('dialog')).not.toBeInTheDocument()
      await expect
        .element(page.getByRole('button', { name: '搜索菜单' }))
        .toHaveFocus()
    }
  )

  it('shows an empty result and clears the query when reopened', async () => {
    await renderSearch()
    await openSearch()
    await page.getByRole('combobox').fill('不存在的菜单-zzzz')
    await expect
      .element(page.getByText('未找到匹配的菜单或命令。'))
      .toBeVisible()

    await page.getByRole('button', { name: '关闭', exact: true }).click()
    await expect.element(page.getByRole('dialog')).not.toBeInTheDocument()
    await openSearch()

    await expect.element(page.getByRole('combobox')).toHaveValue('')
    await expect
      .element(page.getByRole('option', { name: '任务管理', exact: true }))
      .toBeVisible()
  })

  it('restores the theme commands and persists the selected theme', async () => {
    await renderSearch()
    await openSearch()
    await page.getByRole('option', { name: '深色', exact: true }).click()

    await expect.poll(() => getCookie('vite-ui-theme')).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    await expect.element(page.getByRole('dialog')).not.toBeInTheDocument()
  })
})
