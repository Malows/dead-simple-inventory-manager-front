import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useTransferSelection } from '../useTransferSelection'
import type { Product } from '../../../types/product.interfaces'

const mockProduct = (uuid: string): Product => ({
  id: 1,
  uuid,
  name: `Product ${uuid}`,
  code: `CODE-${uuid}`,
  price: 100,
  stock: 10,
  min_stock_warning: 5,
  description: 'Test',
  brand_id: 1,
  supplier_id: 1,
  storage_location_id: 1,
  image_url: null,
  brand: null,
  supplier: null,
  storage_location: null,
  categories: [],
  last_price_update: null,
  last_stock_update: null,
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null
})

describe('useTransferSelection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with empty checked sets', () => {
    const { leftChecked, rightChecked } = useTransferSelection(
      () => [],
      () => []
    )

    expect(leftChecked.value.size).toBe(0)
    expect(rightChecked.value.size).toBe(0)
  })

  it('toggles left check correctly', () => {
    const { leftChecked, toggleLeftCheck } = useTransferSelection(
      () => [],
      () => []
    )

    toggleLeftCheck('item-1')
    expect(leftChecked.value.has('item-1')).toBe(true)

    toggleLeftCheck('item-1')
    expect(leftChecked.value.has('item-1')).toBe(false)
  })

  it('clears right checked when toggling left', () => {
    const { leftChecked, rightChecked, toggleLeftCheck } = useTransferSelection(
      () => [],
      () => []
    )

    rightChecked.value.add('right-1')
    toggleLeftCheck('item-1')

    expect(rightChecked.value.size).toBe(0)
    expect(leftChecked.value.has('item-1')).toBe(true)
  })

  it('toggles right check correctly', () => {
    const { rightChecked, toggleRightCheck } = useTransferSelection(
      () => [],
      () => []
    )

    toggleRightCheck('item-1')
    expect(rightChecked.value.has('item-1')).toBe(true)

    toggleRightCheck('item-1')
    expect(rightChecked.value.has('item-1')).toBe(false)
  })

  it('clears left checked when toggling right', () => {
    const { leftChecked, rightChecked, toggleRightCheck } = useTransferSelection(
      () => [],
      () => []
    )

    leftChecked.value.add('left-1')
    toggleRightCheck('item-1')

    expect(leftChecked.value.size).toBe(0)
    expect(rightChecked.value.has('item-1')).toBe(true)
  })

  it('selectAllLeft selects all available products', () => {
    const products = [mockProduct('p1'), mockProduct('p2'), mockProduct('p3')]
    const { leftChecked, selectAllLeft } = useTransferSelection(
      () => products,
      () => []
    )

    selectAllLeft()

    expect(leftChecked.value.size).toBe(3)
    expect(leftChecked.value.has('p1')).toBe(true)
    expect(leftChecked.value.has('p2')).toBe(true)
    expect(leftChecked.value.has('p3')).toBe(true)
  })

  it('selectAllLeft deselects all if all were selected', () => {
    const products = [mockProduct('p1'), mockProduct('p2')]
    const { leftChecked, selectAllLeft } = useTransferSelection(
      () => products,
      () => []
    )

    selectAllLeft()
    expect(leftChecked.value.size).toBe(2)

    selectAllLeft()
    expect(leftChecked.value.size).toBe(0)
  })

  it('clears right checked when selectAllLeft', () => {
    const products = [mockProduct('p1')]
    const { leftChecked, rightChecked, selectAllLeft } = useTransferSelection(
      () => products,
      () => []
    )

    rightChecked.value.add('r1')
    selectAllLeft()

    expect(rightChecked.value.size).toBe(0)
    expect(leftChecked.value.size).toBe(1)
  })

  it('selectAllRight selects all selected products', () => {
    const products = [mockProduct('p1'), mockProduct('p2'), mockProduct('p3')]
    const { rightChecked, selectAllRight } = useTransferSelection(
      () => [],
      () => products
    )

    selectAllRight()

    expect(rightChecked.value.size).toBe(3)
    expect(rightChecked.value.has('p1')).toBe(true)
  })

  it('selectAllRight deselects all if all were selected', () => {
    const products = [mockProduct('p1'), mockProduct('p2')]
    const { rightChecked, selectAllRight } = useTransferSelection(
      () => [],
      () => products
    )

    selectAllRight()
    expect(rightChecked.value.size).toBe(2)

    selectAllRight()
    expect(rightChecked.value.size).toBe(0)
  })

  it('clears left checked when selectAllRight', () => {
    const products = [mockProduct('p1')]
    const { leftChecked, rightChecked, selectAllRight } = useTransferSelection(
      () => [],
      () => products
    )

    leftChecked.value.add('l1')
    selectAllRight()

    expect(leftChecked.value.size).toBe(0)
    expect(rightChecked.value.size).toBe(1)
  })

  it('computes canMoveRight correctly', () => {
    const { leftChecked, canMoveRight } = useTransferSelection(
      () => [],
      () => []
    )

    expect(canMoveRight.value).toBe(false)

    leftChecked.value.add('item-1')
    expect(canMoveRight.value).toBe(true)
  })

  it('computes canMoveLeft correctly', () => {
    const { rightChecked, canMoveLeft } = useTransferSelection(
      () => [],
      () => []
    )

    expect(canMoveLeft.value).toBe(false)

    rightChecked.value.add('item-1')
    expect(canMoveLeft.value).toBe(true)
  })

  it('computes buttonIcon correctly', () => {
    const { leftChecked, buttonIcon } = useTransferSelection(
      () => [],
      () => []
    )

    expect(buttonIcon.value).toBe('chevron_left')

    leftChecked.value.add('item-1')
    expect(buttonIcon.value).toBe('chevron_right')
  })

  it('computes buttonDisabled correctly', () => {
    const { leftChecked, rightChecked, buttonDisabled } = useTransferSelection(
      () => [],
      () => []
    )

    expect(buttonDisabled.value).toBe(true)

    leftChecked.value.add('item-1')
    expect(buttonDisabled.value).toBe(false)

    leftChecked.value.clear()
    rightChecked.value.add('item-1')
    expect(buttonDisabled.value).toBe(false)
  })

  it('clearLeftChecked empties left set', () => {
    const { leftChecked, clearLeftChecked } = useTransferSelection(
      () => [],
      () => []
    )

    leftChecked.value.add('item-1')
    leftChecked.value.add('item-2')

    clearLeftChecked()
    expect(leftChecked.value.size).toBe(0)
  })

  it('clearRightChecked empties right set', () => {
    const { rightChecked, clearRightChecked } = useTransferSelection(
      () => [],
      () => []
    )

    rightChecked.value.add('item-1')
    rightChecked.value.add('item-2')

    clearRightChecked()
    expect(rightChecked.value.size).toBe(0)
  })
})
