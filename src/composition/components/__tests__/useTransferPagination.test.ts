import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useTransferPagination } from '../useTransferPagination'

describe('useTransferPagination', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes pages to 1', () => {
    const items = () => ['a', 'b', 'c']
    const selected = () => ['d']

    const { leftPage, rightPage } = useTransferPagination(items, selected)

    expect(leftPage.value).toBe(1)
    expect(rightPage.value).toBe(1)
  })

  it('computes left pages correctly', () => {
    const items = () => Array.from({ length: 35 }, (_, i) => `item-${i}`)
    const selected = () => []

    const { leftPages } = useTransferPagination(items, selected, 10)

    expect(leftPages.value).toBe(4) // 35 / 10 = 3.5, ceil = 4
  })

  it('computes right pages correctly', () => {
    const items = () => []
    const selected = () => Array.from({ length: 25 }, (_, i) => `item-${i}`)

    const { rightPages } = useTransferPagination(items, selected, 10)

    expect(rightPages.value).toBe(3) // 25 / 10 = 2.5, ceil = 3
  })

  it('returns at least 1 page when empty', () => {
    const items = () => []
    const selected = () => []

    const { leftPages, rightPages } = useTransferPagination(items, selected)

    expect(leftPages.value).toBe(1)
    expect(rightPages.value).toBe(1)
  })

  it('computes left slice correctly', () => {
    const items = () => ['a', 'b', 'c', 'd', 'e']
    const selected = () => []

    const { leftSlice, leftPage } = useTransferPagination(items, selected, 2)

    expect(leftSlice.value).toEqual(['a', 'b'])

    leftPage.value = 2
    expect(leftSlice.value).toEqual(['c', 'd'])

    leftPage.value = 3
    expect(leftSlice.value).toEqual(['e'])
  })

  it('computes right slice correctly', () => {
    const items = () => []
    const selected = () => ['a', 'b', 'c', 'd', 'e']

    const { rightSlice, rightPage } = useTransferPagination(items, selected, 2)

    expect(rightSlice.value).toEqual(['a', 'b'])

    rightPage.value = 2
    expect(rightSlice.value).toEqual(['c', 'd'])

    rightPage.value = 3
    expect(rightSlice.value).toEqual(['e'])
  })

  it('resetLeftPage sets left page to 1', () => {
    const items = () => Array.from({ length: 50 }, (_, i) => `item-${i}`)
    const selected = () => []

    const { leftPage, resetLeftPage } = useTransferPagination(items, selected, 10)

    leftPage.value = 5
    expect(leftPage.value).toBe(5)

    resetLeftPage()
    expect(leftPage.value).toBe(1)
  })

  it('uses custom itemsPerPage value', () => {
    const items = () => Array.from({ length: 100 }, (_, i) => `item-${i}`)
    const selected = () => []

    const { leftPages } = useTransferPagination(items, selected, 25)

    expect(leftPages.value).toBe(4) // 100 / 25 = 4
  })

  it('returns watchFilters function', () => {
    const items = () => ['a', 'b']
    const selected = () => []

    const { watchFilters } = useTransferPagination(items, selected)

    expect(typeof watchFilters).toBe('function')
  })
})
