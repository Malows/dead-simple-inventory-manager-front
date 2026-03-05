import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import SupplierForm from '../SupplierForm.vue'

// Mock useI18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: vi.fn((key: string) => key) // Return key as is for simplicity
  })
}))

const mountComponent = (props = {}) =>
  mount(SupplierForm, { props: { ...props } })

describe('SupplierForm.vue', () => {
  it('renders all form inputs', () => {
    const wrapper = mountComponent()
    const inputs = wrapper.findAllComponents({ name: 'QInput' })
    expect(inputs).toHaveLength(5)
  })

  it('binds v-model correctly for name', async () => {
    const wrapper = mountComponent()
    wrapper.vm.name = 'Test Supplier'
    expect(wrapper.emitted('update:name')?.[0]).toEqual(['Test Supplier'])
  })

  it('binds v-model correctly for address', async () => {
    const wrapper = mountComponent()
    wrapper.vm.address = 'Test Address'
    expect(wrapper.emitted('update:address')?.[0]).toEqual(['Test Address'])
  })

  it('binds v-model correctly for phone', async () => {
    const wrapper = mountComponent()
    wrapper.vm.phone = '123456789'
    expect(wrapper.emitted('update:phone')?.[0]).toEqual(['123456789'])
  })

  it('binds v-model correctly for email', async () => {
    const wrapper = mountComponent()
    wrapper.vm.email = 'test@example.com'
    expect(wrapper.emitted('update:email')?.[0]).toEqual(['test@example.com'])
  })

  it('binds v-model correctly for web', async () => {
    const wrapper = mountComponent()
    wrapper.vm.web = 'https://example.com'
    expect(wrapper.emitted('update:web')?.[0]).toEqual(['https://example.com'])
  })
})
