import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

import PriceTab from '../PriceTab.vue'

const {
  mockAdjustBrandPrice,
  mockAdjustSupplierPrice,
  mockAdjustCategoryPrice,
  mockExecute
} = vi.hoisted(() => ({
  mockAdjustBrandPrice: vi.fn(),
  mockAdjustSupplierPrice: vi.fn(),
  mockAdjustCategoryPrice: vi.fn(),
  mockExecute: vi.fn()
}))

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key })
}))

vi.mock('../../../../composition/components/useBulkSubmit', () => ({
  useBulkSubmit: () => ({ execute: mockExecute })
}))

vi.mock('../../../../services/BulkOperationService', () => ({
  bulkOperationService: {
    adjustBrandPrice: mockAdjustBrandPrice,
    adjustSupplierPrice: mockAdjustSupplierPrice,
    adjustCategoryPrice: mockAdjustCategoryPrice
  }
}))

vi.mock('../../../../components/filterable/FilterableSelect.vue', () => ({
  default: {
    name: 'FilterableSelect',
    props: ['modelValue', 'label', 'options'],
    emits: ['update:modelValue'],
    template: '<div>FilterableSelect</div>'
  }
}))

describe('PriceTab.vue', () => {
  let pinia: ReturnType<typeof createTestingPinia>

  const mountComponent = () =>
    mount(PriceTab, {
      global: {
        plugins: [pinia],
        stubs: {
          QSelect: {
            name: 'QSelect',
            props: ['modelValue', 'options', 'label'],
            emits: ['update:modelValue'],
            template: '<div>QSelect</div>'
          },
          QInput: {
            name: 'QInput',
            props: ['modelValue', 'label', 'hint'],
            emits: ['update:modelValue'],
            template: '<div>QInput</div>'
          },
          QBtn: {
            name: 'QBtn',
            props: ['label', 'disable'],
            emits: ['click'],
            template: '<button :disabled="disable" @click="$emit(\'click\')">{{ label }}</button>'
          }
        }
      }
    })

  beforeEach(() => {
    vi.clearAllMocks()
    pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: {
        brands: {
          brands: [{ id: 1, uuid: 'brand-uuid-123', name: 'Brand One' }]
        },
        suppliers: {
          suppliers: [{ id: 1, uuid: 'supplier-uuid-123', name: 'Supplier One' }]
        },
        categories: {
          categories: [{ id: 1, uuid: 'category-uuid-123', name: 'Category One' }]
        }
      }
    })
    mockExecute.mockImplementation((action) => action())
    mockAdjustBrandPrice.mockResolvedValue({ isOk: true })
    mockAdjustSupplierPrice.mockResolvedValue({ isOk: true })
    mockAdjustCategoryPrice.mockResolvedValue({ isOk: true })
  })

  it('starts with submit disabled and no entity selector', () => {
    const wrapper = mountComponent()

    expect(wrapper.findComponent({ name: 'FilterableSelect' }).exists()).toBe(false)
    expect(wrapper.findComponent({ name: 'QBtn' }).props('disable')).toBe(true)
  })

  it('shows entity selector and hint for percentage adjustments', async () => {
    const wrapper = mountComponent()
    const selects = wrapper.findAllComponents({ name: 'QSelect' })
    await selects[0]?.vm.$emit('update:modelValue', 'brand')
    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent({ name: 'FilterableSelect' }).exists()).toBe(true)

    const updatedSelects = wrapper.findAllComponents({ name: 'QSelect' })
    await updatedSelects[1]?.vm.$emit('update:modelValue', 'price_percentage')
    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent({ name: 'QInput' }).props('hint')).toBe('operations.hint_percentage')
  })

  it('submits the selected brand price adjustment and resets state on success', async () => {
    mockExecute.mockImplementation(async (action, _success, _error, onSuccess) => {
      await action()
      onSuccess?.()
    })

    const wrapper = mountComponent()
    const initialSelects = wrapper.findAllComponents({ name: 'QSelect' })
    await initialSelects[0]?.vm.$emit('update:modelValue', 'brand')
    await wrapper.vm.$nextTick()

    const entitySelect = wrapper.findComponent({ name: 'FilterableSelect' })
    await entitySelect.vm.$emit('update:modelValue', 'brand-uuid-123')
    await wrapper.vm.$nextTick()

    const selects = wrapper.findAllComponents({ name: 'QSelect' })
    const input = wrapper.findComponent({ name: 'QInput' })

    await selects[1]?.vm.$emit('update:modelValue', 'price_fixed')
    await input.vm.$emit('update:modelValue', 25)
    await wrapper.vm.$nextTick()

    await wrapper.findComponent({ name: 'QBtn' }).trigger('click')
    await flushPromises()

    expect(mockExecute).toHaveBeenCalledWith(
      expect.any(Function),
      'operations.price_updated',
      'operations.error_price',
      expect.any(Function)
    )
    expect(mockAdjustBrandPrice).toHaveBeenCalledWith('brand-uuid-123', {
      type: 'price_fixed',
      value: 25
    })
    expect(wrapper.findComponent({ name: 'FilterableSelect' }).exists()).toBe(false)
    expect(wrapper.findComponent({ name: 'QBtn' }).props('disable')).toBe(true)
  })

  it('does not submit if the form is incomplete', async () => {
    const wrapper = mountComponent()
    const selects = wrapper.findAllComponents({ name: 'QSelect' })
    await selects[0]?.vm.$emit('update:modelValue', 'supplier')
    await wrapper.vm.$nextTick()

    await wrapper.findComponent({ name: 'QBtn' }).trigger('click')
    await flushPromises()

    expect(mockExecute).not.toHaveBeenCalled()
    expect(mockAdjustSupplierPrice).not.toHaveBeenCalled()
  })
})
