import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'

import SupplierForm from '../SupplierForm.vue'

vi.mock('vue-i18n', () => ({
  useI18n: vi.fn(() => ({
    t: vi.fn((key: string) => key)
  }))
}))

const mountComponent = (props = {}) =>
  mount(SupplierForm, { props: { ...props } })

describe('SupplierForm.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders form inputs', () => {
    const wrapper = mountComponent()
    const inputs = wrapper.findAllComponents({ name: 'QInput' })
    expect(inputs.length).toBe(5)
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
    wrapper.vm.phone = '123-456-7890'
    expect(wrapper.emitted('update:phone')?.[0]).toEqual(['123-456-7890'])
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
