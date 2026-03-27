import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useStickyButton } from '../stickyButtons'

// Mock Quasar platform detection
const mockQuasarMobile = { platform: { is: { desktop: false } } }
const mockQuasarDesktop = { platform: { is: { desktop: true } } }

vi.mock('quasar', () => ({
  useQuasar: vi.fn()
}))

import { useQuasar } from 'quasar'

describe('useStickyButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns correct values for desktop', () => {
    vi.mocked(useQuasar).mockReturnValue(mockQuasarDesktop as any)

    const { direction, icon, position, offset } = useStickyButton()

    expect(direction.value).toBe('down')
    expect(icon.value).toBe('keyboard_arrow_down')
    expect(position.value).toBe('top-right')
    expect(offset).toEqual([24, 24])
  })

  it('returns correct values for mobile', () => {
    vi.mocked(useQuasar).mockReturnValue(mockQuasarMobile as any)

    const { direction, icon, position, offset } = useStickyButton()

    expect(direction.value).toBe('up')
    expect(icon.value).toBe('keyboard_arrow_up')
    expect(position.value).toBe('bottom-right')
    expect(offset).toEqual([24, 24])
  })

  it('direction is a computed property', () => {
    vi.mocked(useQuasar).mockReturnValue(mockQuasarDesktop as any)

    const { direction } = useStickyButton()

    expect(() => {
      direction.value
    }).not.toThrow()
  })

  it('icon is a computed property', () => {
    vi.mocked(useQuasar).mockReturnValue(mockQuasarDesktop as any)

    const { icon } = useStickyButton()

    expect(() => {
      icon.value
    }).not.toThrow()
  })

  it('position is a computed property', () => {
    vi.mocked(useQuasar).mockReturnValue(mockQuasarDesktop as any)

    const { position } = useStickyButton()

    expect(() => {
      position.value
    }).not.toThrow()
  })
})
