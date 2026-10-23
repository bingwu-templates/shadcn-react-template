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
      .element(screen.getByRole('radio', { name: 'System', exact: true }))
      .toBeChecked()
    await screen.getByRole('button', { name: 'Update preferences' }).click()

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

    await screen.getByRole('radio', { name: 'Dark', exact: true }).click()
    await screen.getByRole('button', { name: 'Update preferences' }).click()
    await expect.poll(() => getCookie('vite-ui-theme')).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    await screen.getByRole('button', { name: 'Toggle theme' }).click()
    await page.getByRole('menuitem', { name: 'Light', exact: true }).click()

    await expect
      .element(screen.getByRole('radio', { name: 'Light', exact: true }))
      .toBeChecked()
    expect(getCookie('vite-ui-theme')).toBe('light')
    expect(document.documentElement.classList.contains('light')).toBe(true)
  })
})
