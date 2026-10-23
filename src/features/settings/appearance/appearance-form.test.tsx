import { clearCookies } from '@/test-utils/cookies'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { page } from 'vitest/browser'
import { getCookie } from '@/lib/cookies'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { ThemeProvider } from '@/context/theme-provider'
import { ThemeSwitch } from '@/components/theme-switch'
import { AppearanceForm } from './appearance-form'

vi.mock('@/lib/show-submitted-data', () => ({
  showSubmittedData: vi.fn(),
}))

describe('Appearance preferences', () => {
  beforeEach(() => {
    clearCookies()
    vi.clearAllMocks()
  })

  it('accepts the default system theme when saving preferences', async () => {
    const screen = await render(
      <ThemeProvider>
        <AppearanceForm />
      </ThemeProvider>
    )

    await expect
      .element(screen.getByRole('radio', { name: '跟随系统', exact: true }))
      .toBeChecked()
    await screen.getByRole('button', { name: '保存偏好设置' }).click()

    await expect
      .poll(() => vi.mocked(showSubmittedData).mock.calls)
      .toEqual([[{ theme: 'system' }]])
    expect(getCookie('vite-ui-theme')).toBe('system')
  })

  it('persists a selected theme and stays in sync with the header switch', async () => {
    const screen = await render(
      <ThemeProvider>
        <ThemeSwitch />
        <AppearanceForm />
      </ThemeProvider>
    )

    await screen.getByRole('radio', { name: '深色', exact: true }).click()
    await screen.getByRole('button', { name: '保存偏好设置' }).click()
    await expect.poll(() => getCookie('vite-ui-theme')).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    await screen.getByRole('button', { name: '切换主题' }).click()
    await page.getByRole('menuitem', { name: '浅色', exact: true }).click()

    await expect
      .element(screen.getByRole('radio', { name: '浅色', exact: true }))
      .toBeChecked()
    expect(getCookie('vite-ui-theme')).toBe('light')
    expect(document.documentElement.classList.contains('light')).toBe(true)
  })
})
