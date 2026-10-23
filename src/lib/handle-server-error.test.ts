import ky, { HTTPError } from 'ky'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { handleServerError } from './handle-server-error'

const toastError = vi.hoisted(() => vi.fn())

vi.mock('sonner', () => ({
  toast: {
    error: toastError,
  },
}))

beforeEach(() => {
  vi.mocked(toastError).mockClear()
})

async function createHttpError(response: Response) {
  const error = await ky('https://example.com/api', {
    fetch: () => Promise.resolve(response),
    retry: 0,
  }).catch((error: unknown) => error)

  expect(error).toBeInstanceOf(HTTPError)
  return error
}

describe('handleServerError', () => {
  it('shows a generic message when the error is not recognised', () => {
    handleServerError(new Error('network'))

    expect(toastError).toHaveBeenCalledWith('操作失败，请稍后重试。')
  })

  it('maps a plain object with status 204 to the no-content message', () => {
    handleServerError({ status: 204 })

    expect(toastError).toHaveBeenCalledWith('暂无内容。')
  })

  it('prefers the API title parsed by ky from an HTTP error response', async () => {
    const error = await createHttpError(
      Response.json({ title: 'Validation failed' }, { status: 422 })
    )

    handleServerError(error)

    expect(toastError).toHaveBeenCalledWith('Validation failed')
  })

  it.each([{}, { title: '' }, { title: 123 }, null, 'Bad request'])(
    'falls back to the generic message for response data %j',
    async (data) => {
      const error = await createHttpError(Response.json(data, { status: 500 }))

      handleServerError(error)

      expect(toastError).toHaveBeenCalledWith('操作失败，请稍后重试。')
    }
  )

  it.each([
    new Response('Service unavailable', { status: 503 }),
    new Response('{invalid json', {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    }),
    new Response(null, { status: 500 }),
  ])(
    'falls back to the generic message for a non-JSON or empty response %#',
    async (response) => {
      const error = await createHttpError(response)

      handleServerError(error)

      expect(toastError).toHaveBeenCalledWith('操作失败，请稍后重试。')
    }
  )

  it('logs the error to the console in development', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    const err = new Error('logged')

    handleServerError(err)

    expect(log).toHaveBeenCalledTimes(1)
    expect(log).toHaveBeenCalledWith(err)

    log.mockRestore()
  })

  it('does not log the error to the console in production', () => {
    vi.stubEnv('DEV', false)

    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    const err = new Error('not logged')

    handleServerError(err)

    expect(log).not.toHaveBeenCalled()

    log.mockRestore()
  })
})
