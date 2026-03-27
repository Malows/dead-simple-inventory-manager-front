import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useImageUpload } from '../useImageUpload'
import { validateImageFile, createImagePreview, compressImage } from '../../../utils/image'

// Mock dependencies
const mockNotify = vi.fn()
vi.mock('quasar', () => ({
  useQuasar: () => ({
    notify: mockNotify
  })
}))

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key })
}))

vi.mock('../../../utils/image', () => ({
  validateImageFile: vi.fn(),
  createImagePreview: vi.fn(),
  compressImage: vi.fn(),
  formatFileSize: vi.fn().mockReturnValue('1 MB')
}))

describe('useImageUpload', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('onFileSelected should reset when file is null', async () => {
    const { onFileSelected, selectedFile, previewUrl } = useImageUpload()

    // Set some values first
    selectedFile.value = new File([''], 'test.jpg')
    previewUrl.value = 'preview'

    await onFileSelected(null)

    expect(selectedFile.value).toBeNull()
    expect(previewUrl.value).toBeNull()
  })

  it('onFileSelected should notify error when validation fails', async () => {
    vi.mocked(validateImageFile).mockReturnValue('Invalid image')

    const { onFileSelected, selectedFile } = useImageUpload()
    const file = new File([''], 'test.jpg')

    await onFileSelected(file)

    expect(mockNotify).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Invalid image',
      color: 'negative'
    }))
    expect(selectedFile.value).toBeNull()
  })

  it('onFileSelected should successfully process image', async () => {
    vi.mocked(validateImageFile).mockReturnValue(null)
    const compressedFile = new File(['compressed'], 'compressed.jpg')
    vi.mocked(compressImage).mockResolvedValue(compressedFile)
    vi.mocked(createImagePreview).mockResolvedValue('new-preview')

    const { onFileSelected, selectedFile, previewUrl } = useImageUpload()
    const file = new File(['raw'], 'raw.jpg')

    await onFileSelected(file)

    expect(compressImage).toHaveBeenCalledWith(file)
    expect(selectedFile.value?.name).toBe(compressedFile.name)
    expect(previewUrl.value).toBe('new-preview')
  })

  it('onFileSelected should handle compression error and notify', async () => {
    vi.mocked(validateImageFile).mockReturnValue(null)
    vi.mocked(compressImage).mockRejectedValue(new Error('compression failed'))

    const { onFileSelected, selectedFile, previewUrl, isCompressing } = useImageUpload()
    const file = new File(['raw'], 'raw.jpg')

    await onFileSelected(file)

    expect(mockNotify).toHaveBeenCalledWith(expect.objectContaining({ color: 'negative' }))
    expect(selectedFile.value).toBeNull()
    expect(previewUrl.value).toBeNull()
    expect(isCompressing.value).toBe(false)
  })

  it('reset should clear selectedFile and previewUrl', () => {
    const { reset, selectedFile, previewUrl } = useImageUpload()
    selectedFile.value = new File([''], 'test.jpg')
    previewUrl.value = 'preview'

    reset()

    expect(selectedFile.value).toBeNull()
    expect(previewUrl.value).toBeNull()
  })

  it('fileInfo returns null when no file selected', () => {
    const { fileInfo } = useImageUpload()
    expect(fileInfo.value).toBeNull()
  })

  it('fileInfo returns name and size when file is selected', async () => {
    vi.mocked(validateImageFile).mockReturnValue(null)
    const compressedFile = new File(['data'], 'photo.jpg')
    vi.mocked(compressImage).mockResolvedValue(compressedFile)
    vi.mocked(createImagePreview).mockResolvedValue('preview')

    const { onFileSelected, fileInfo } = useImageUpload()
    await onFileSelected(compressedFile)

    expect(fileInfo.value).not.toBeNull()
    expect(fileInfo.value?.name).toBe('photo.jpg')
    expect(fileInfo.value?.size).toBe('1 MB')
  })
})
