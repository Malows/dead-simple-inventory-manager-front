import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('vue', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue')>()
  return {
    ...actual,
    onMounted: vi.fn((cb: () => void) => cb())
  }
})

vi.mock('web-vitals', () => ({
  onCLS: vi.fn(),
  onFCP: vi.fn(),
  onLCP: vi.fn(),
  onTTFB: vi.fn()
}))

import { onMounted } from 'vue'
import { onCLS, onFCP, onLCP, onTTFB } from 'web-vitals'
import { useWebVitals } from '../useWebVitals'

describe('useWebVitals', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('registers an onMounted hook', () => {
    useWebVitals()
    expect(onMounted).toHaveBeenCalledOnce()
  })

  it('calls all web-vitals collectors inside onMounted', () => {
    useWebVitals()
    expect(onCLS).toHaveBeenCalledWith(console.log)
    expect(onFCP).toHaveBeenCalledWith(console.log)
    expect(onLCP).toHaveBeenCalledWith(console.log)
    expect(onTTFB).toHaveBeenCalledWith(console.log)
  })
})
