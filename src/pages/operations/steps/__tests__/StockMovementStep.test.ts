import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'

import StockMovementStep from '../StockMovementStep.vue'

// Mock dependencies
vi.mock('vue-i18n', () => ({
  useI18n: vi.fn(() => ({
    t: vi.fn((key: string) => key)
  }))
}))

import { useI18n } from 'vue-i18n'

describe('StockMovementStep.vue', () => {
  let mockI18n: any

  beforeEach(() => {
    mockI18n = {
      t: vi.fn((key) => key)
    }
    vi.mocked(useI18n).mockReturnValue(mockI18n)
  })

  const mountComponent = (props = {}) => {
    return mount(StockMovementStep, {
      props,
      global: {
        stubs: {
          SelectableCard: true
        }
      }
    })
  }

  it('renders selectable cards for movement types', () => {
    const wrapper = mountComponent()
    const cards = wrapper.findAllComponents({ name: 'SelectableCard' })
    expect(cards).toHaveLength(4)
  })

  it('binds movement type model', async () => {
    const wrapper = mountComponent()
    const cards = wrapper.findAllComponents({ name: 'SelectableCard' })
    const purchaseCard = cards[0] // purchase
    await purchaseCard.vm.$emit('update:modelValue', 'purchase')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['purchase'])
  })
})
