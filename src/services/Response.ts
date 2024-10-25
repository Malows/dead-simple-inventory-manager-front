interface HttpError {
  message: string
  statusText: string
}

interface HttpData<T> {
  isOk?: boolean
  code?: number
  error?: HttpError
  message?: string
  data?: T | null
}

class HttpResponse<T> {
  isOk?: boolean
  code?: number
  error?: HttpError | null
  message?: string
  data?: T | null

  constructor (res: HttpData<T>) {
    this.isOk = res.isOk
    this.code = res.code
    this.error = res.error
    this.message = res.message
    this.data = res.data
  }
}

export default HttpResponse

export async function handle<T> (fetchPromise: Promise<Response>) {
  const load = new HttpResponse<T>({})

  try {
    const res = await fetchPromise
    load.isOk = res.ok
    load.code = res.status
    load.message = ''
    load.error = null
    load.data = await res.json() as T
  } catch (error) {
    const _error = error as HttpError
    load.isOk = false
    load.message = _error.message || _error.statusText
    load.error = _error
    load.code = -1
    load.data = null
  }

  return load
}
