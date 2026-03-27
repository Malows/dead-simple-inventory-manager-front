import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useBulkSubmit } from '../useBulkSubmit'

// Mock dependencies
const mockNotify = vi.fn()
const mockLoading = { show: vi.fn(), hide: vi.fn() }

vi.mock('quasar', () => ({
  useQuasar: () => ({
    notify: mockNotify,
    loading: mockLoading
  })
}))

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key })
}))

const mockForceGetProducts = vi.fn()
vi.mock('../../../stores/products', () => ({
  useProductsStore: () => ({
    forceGetProducts: mockForceGetProducts
  })
}))

describe('useBulkSubmit', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('execute should call success and reload products on success', async () => {
    const { execute } = useBulkSubmit()
    const action = vi.fn().mockResolvedValue({ isOk: true })
    const onSuccess = vi.fn()

    await execute(action, 'success', 'error', onSuccess)

    expect(mockLoading.show).toHaveBeenCalled()
    expect(mockNotify).toHaveBeenCalledWith({ color: 'positive', message: 'success' })
    expect(onSuccess).toHaveBeenCalled()
    expect(mockForceGetProducts).toHaveBeenCalled()
    expect(mockLoading.hide).toHaveBeenCalled()
  })

  it('execute should notify error on failure', async () => {
    const { execute } = useBulkSubmit()
    const action = vi.fn().mockResolvedValue({ isOk: false })

    await execute(action, 'success', 'error')

    expect(mockNotify).toHaveBeenCalledWith({ color: 'negative', message: 'error' })
    expect(mockForceGetProducts).not.toHaveBeenCalled()
    expect(mockLoading.hide).toHaveBeenCalled()
  })
})
