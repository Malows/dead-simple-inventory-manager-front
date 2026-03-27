import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ProductPhotoDialog from '../ProductPhotoDialog.vue'
import { ref } from 'vue'

// Mock dependencies
const mockNotify = vi.fn()
const mockLoading = { show: vi.fn(), hide: vi.fn() }
vi.mock('quasar', async (importOriginal) => {
  const actual = await importOriginal<typeof import('quasar')>()
  return {
    ...actual,
    useQuasar: () => ({
      notify: mockNotify,
      loading: mockLoading
    })
  }
})
vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key })
}))

const mockUploadProductImage = vi.fn()
vi.mock('../../../stores/products', () => ({
  useProductsStore: () => ({
    uploadProductImage: mockUploadProductImage
  })
}))

const selectedFile = ref<File | null>(null)
const reset = vi.fn()
vi.mock('../../../composition/components/useImageUpload', () => ({
  useImageUpload: () => ({
    selectedFile,
    previewUrl: ref(null),
    isCompressing: ref(false),
    fileInfo: ref(null),
    onFileSelected: vi.fn(),
    reset
  })
}))

describe('ProductPhotoDialog.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    selectedFile.value = null
  })

  it('renders correctly', () => {
    const wrapper = mount(ProductPhotoDialog, {
      props: {
        product: { uuid: '123', name: 'Test Product' } as any
      },
      global: {
        stubs: ['q-dialog', 'q-card', 'q-card-section', 'q-file', 'q-btn', 'q-icon', 'q-spinner', 'q-img', 'q-separator', 'q-card-actions']
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('uploadImage calls uploadProductImage and notifies on success', async () => {
    const file = new File(['content'], 'test.jpg')
    selectedFile.value = file
    mockUploadProductImage.mockResolvedValue({ isOk: true })

    const wrapper = mount(ProductPhotoDialog, {
      props: {
        product: { uuid: '123', name: 'Test Product' } as any
      },
      global: {
        stubs: ['q-dialog', 'q-card', 'q-card-section', 'q-file', 'q-btn', 'q-icon', 'q-spinner', 'q-img', 'q-separator', 'q-card-actions']
      }
    })

    // Trigger upload
    const vm = wrapper.vm as any
    await vm.uploadImage()

    expect(mockLoading.show).toHaveBeenCalled()
    expect(mockUploadProductImage).toHaveBeenCalledWith('123', file)
    expect(mockNotify).toHaveBeenCalledWith(expect.objectContaining({
      color: 'positive',
      message: 'products.photo_uploaded'
    }))
    expect(reset).toHaveBeenCalled()
    expect(mockLoading.hide).toHaveBeenCalled()
  })

  it('uploadImage notifies error on API failure', async () => {
    const file = new File(['content'], 'test.jpg')
    selectedFile.value = file
    mockUploadProductImage.mockResolvedValue({ isOk: false })

    const wrapper = mount(ProductPhotoDialog, {
      props: {
        product: { uuid: '123', name: 'Test Product' } as any
      },
      global: {
        stubs: ['q-dialog', 'q-card', 'q-card-section', 'q-file', 'q-btn', 'q-icon', 'q-spinner', 'q-img', 'q-separator', 'q-card-actions']
      }
    })

    const vm = wrapper.vm as any
    await vm.uploadImage()

    expect(mockNotify).toHaveBeenCalledWith(expect.objectContaining({
      color: 'negative',
      message: 'products.error_uploading'
    }))
    expect(mockLoading.hide).toHaveBeenCalled()
  })

  it('uploadImage handles exceptions', async () => {
    const file = new File(['content'], 'test.jpg')
    selectedFile.value = file
    mockUploadProductImage.mockRejectedValue(new Error('Network error'))

    const wrapper = mount(ProductPhotoDialog, {
      props: {
        product: { uuid: '123', name: 'Test Product' } as any
      },
      global: {
        stubs: ['q-dialog', 'q-card', 'q-card-section', 'q-file', 'q-btn', 'q-icon', 'q-spinner', 'q-img', 'q-separator', 'q-card-actions']
      }
    })

    const vm = wrapper.vm as any
    await vm.uploadImage()

    expect(mockNotify).toHaveBeenCalledWith(expect.objectContaining({
      color: 'negative',
      message: 'products.error_uploading'
    }))
    expect(mockLoading.hide).toHaveBeenCalled()
  })
})
