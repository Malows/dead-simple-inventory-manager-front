import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useEntitySelection } from '../useEntitySelection'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key })
}))

vi.mock('../../../stores/brands', () => ({
  useBrandsStore: () => ({
    brands: [
      { id: 1, uuid: 'brand-1', name: 'Brand A' },
      { id: 2, uuid: 'brand-2', name: 'Brand B' }
    ]
  })
}))

vi.mock('../../../stores/suppliers', () => ({
  useSuppliersStore: () => ({
    suppliers: [
      { id: 1, uuid: 'supplier-1', name: 'Supplier A' },
      { id: 2, uuid: 'supplier-2', name: 'Supplier B' }
    ]
  })
}))

vi.mock('../../../stores/categories', () => ({
  useCategoriesStore: () => ({
    categories: [
      { id: 1, uuid: 'category-1', name: 'Category A' },
      { id: 2, uuid: 'category-2', name: 'Category B' }
    ]
  })
}))

describe('useEntitySelection', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('initializes with null values', () => {
    const { entityType, entityUuid } = useEntitySelection()

    expect(entityType.value).toBeNull()
    expect(entityUuid.value).toBeNull()
  })

  it('computes entity type options correctly', () => {
    const { entityTypeOptions } = useEntitySelection()

    expect(entityTypeOptions.value).toHaveLength(3)
    expect(entityTypeOptions.value[0]?.value).toBe('brand')
    expect(entityTypeOptions.value[1]?.value).toBe('supplier')
    expect(entityTypeOptions.value[2]?.value).toBe('category')
  })

  it('returns empty entity options when no type selected', () => {
    const { entityOptions } = useEntitySelection()

    expect(entityOptions.value).toHaveLength(0)
  })

  it('computes brand options when type is brand', async () => {
    const { entityType, entityOptions } = useEntitySelection()

    entityType.value = 'brand'
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(entityOptions.value).toHaveLength(2)
    expect(entityOptions.value[0]?.label).toBe('Brand A')
    expect(entityOptions.value[0]?.value).toBe('brand-1')
  })

  it('computes supplier options when type is supplier', async () => {
    const { entityType, entityOptions } = useEntitySelection()

    entityType.value = 'supplier'
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(entityOptions.value).toHaveLength(2)
    expect(entityOptions.value[0]?.label).toBe('Supplier A')
    expect(entityOptions.value[0]?.value).toBe('supplier-1')
  })

  it('computes category options when type is category', async () => {
    const { entityType, entityOptions } = useEntitySelection()

    entityType.value = 'category'
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(entityOptions.value).toHaveLength(2)
    expect(entityOptions.value[0]?.label).toBe('Category A')
    expect(entityOptions.value[0]?.value).toBe('category-1')
  })

  it('clears uuid when entity type changes', async () => {
    const { entityType, entityUuid } = useEntitySelection()

    entityType.value = 'brand'
    entityUuid.value = 'some-uuid'

    entityType.value = 'supplier'
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(entityUuid.value).toBeNull()
  })

  it('resets both values on reset call', () => {
    const { entityType, entityUuid, reset } = useEntitySelection()

    entityType.value = 'brand'
    entityUuid.value = 'something'

    reset()

    expect(entityType.value).toBeNull()
    expect(entityUuid.value).toBeNull()
  })
})
