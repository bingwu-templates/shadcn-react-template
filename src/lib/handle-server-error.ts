import { HTTPError } from 'ky'
import { toast } from 'sonner'

export function handleServerError(error: unknown) {
  if (import.meta.env.DEV) {
    // oxlint-disable-next-line no-console
    console.log(error)
  }

  let errMsg = '操作失败，请稍后重试。'

  if (
    error &&
    typeof error === 'object' &&
    'status' in error &&
    Number(error.status) === 204
  ) {
    errMsg = '暂无内容。'
  }

  if (
    error instanceof HTTPError &&
    error.data &&
    typeof error.data === 'object' &&
    'title' in error.data
  ) {
    const { title } = error.data
    if (typeof title === 'string' && title.length > 0) {
      errMsg = title
    }
  }

  toast.error(errMsg)
}
