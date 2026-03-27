import { describe, it, expect, vi } from 'vitest'
import { useNotify } from '../useNotify'

// Mocking dependencies
vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key })
}))

const mockNotify = vi.fn()
vi.mock('quasar', () => ({
  useQuasar: () => ({
    notify: mockNotify
  })
}))

const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush
  })
}))

describe('useNotify', () => {
  it('errorNotify should notify and optionally route', () => {
    const { errorNotify } = useNotify()
    const error = new Error('fail')
    const route = { name: 'login' }

    errorNotify('error_message', route as any)(error)

    expect(mockNotify).toHaveBeenCalledWith({
      color: 'negative',
      message: 'error_message'
    })
    expect(mockPush).toHaveBeenCalledWith(route)
  })

  it('goodNotify should notify and optionally route on success', () => {
    const { goodNotify } = useNotify()
    const response = { isOk: true, data: 'data' }
    const route = { name: 'home' }

    goodNotify('success_message', route as any)(response as any)

    expect(mockNotify).toHaveBeenCalledWith({
      color: 'positive',
      message: 'success_message'
    })
    expect(mockPush).toHaveBeenCalledWith(route)
  })

  it('goodNotify should throw on failure', () => {
    const { goodNotify } = useNotify()
    const response = { isOk: false, error: 'failed' }

    expect(() => goodNotify('success_message')(response as any)).toThrow('failed')
  })
})
