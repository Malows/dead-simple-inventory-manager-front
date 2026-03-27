import { describe, it, expect, vi } from 'vitest'

// Mock dependencies
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn()
  }))
}))

vi.mock('vue-i18n', () => ({
  useI18n: vi.fn(() => ({
    t: vi.fn((key) => key)
  }))
}))

vi.mock('quasar', async () => {
  const actual = await vi.importActual('quasar')
  return {
    ...actual,
    useQuasar: vi.fn(() => ({
      loading: {
        show: vi.fn(),
        hide: vi.fn()
      },
      notify: vi.fn()
    }))
  }
})

import { mount } from '@vue/test-utils'

import BaseDeleteDialog from '../BaseDeleteDialog.vue'

describe('BaseDeleteDialog.vue', () => {
  const props = {
    confirmMessage: 'Are you sure?',
    deleteAction: vi.fn(),
    successRoute: 'products',
    successMessageKey: 'deleted',
    errorMessageKey: 'error'
  }

  // it('renders the dialog with confirm message', async () => {
  //   const wrapper = mount(BaseDeleteDialog, { props, attachTo: document.body })

  //   wrapper.vm.show = true
  //   await wrapper.vm.$nextTick()

  //   expect(wrapper.html()).toContain(props.confirmMessage)
  // })

  it('calls deleteAction on delete button click', async () => {
    props.deleteAction.mockResolvedValue({ isOk: true })
    const wrapper = mount(BaseDeleteDialog, { props, attachTo: document.body })

    const vm = wrapper.vm as any
    vm.show = true
    await vm.$nextTick()

    const deleteBtn = wrapper.findComponent({ name: 'QBtn', props: { color: 'red' } })
    await deleteBtn.trigger('click')

    expect(props.deleteAction).toHaveBeenCalled()
  })

  it('shows loading and notifies success on ok result', async () => {
    const mockQuasar = { loading: { show: vi.fn(), hide: vi.fn() }, notify: vi.fn() } as any
    const mockRouter = { push: vi.fn() } as any
    vi.mocked(useQuasar).mockReturnValue(mockQuasar)
    vi.mocked(useRouter).mockReturnValue(mockRouter)
    props.deleteAction.mockResolvedValue({ isOk: true })

    const wrapper = mount(BaseDeleteDialog, { props, attachTo: document.body })

    const vm = wrapper.vm as any
    vm.show = true
    await vm.$nextTick()

    const deleteBtn = wrapper.findComponent({ name: 'QBtn', props: { color: 'red' } })
    await deleteBtn.trigger('click')

    expect(mockQuasar.loading.show).toHaveBeenCalled()
    expect(mockQuasar.notify).toHaveBeenCalledWith({ color: 'positive', message: 'deleted' })
    expect(mockRouter.push).toHaveBeenCalledWith({ name: 'products' })
    expect(mockQuasar.loading.hide).toHaveBeenCalled()
  })

  it('handles error result', async () => {
    const mockQuasar = { loading: { show: vi.fn(), hide: vi.fn() }, notify: vi.fn() } as any
    vi.mocked(useQuasar).mockReturnValue(mockQuasar)
    props.deleteAction.mockResolvedValue({ isOk: false })

    const wrapper = mount(BaseDeleteDialog, { props, attachTo: document.body })

    const vm = wrapper.vm as any
    vm.show = true
    await vm.$nextTick()

    const deleteBtn = wrapper.findComponent({ name: 'QBtn', props: { color: 'red' } })
    await deleteBtn.trigger('click')

    expect(mockQuasar.notify).toHaveBeenCalledWith({ color: 'negative', message: 'error' })
  })
})
