import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

import {
  validateImageFile,
  createImagePreview,
  compressImage,
  formatFileSize
} from '../../utils/image'

export function useImageUpload () {
  const quasar = useQuasar()
  const { t } = useI18n()

  const selectedFile = ref<File | null>(null)
  const previewUrl = ref<string | null>(null)
  const isCompressing = ref(false)

  const fileInfo = computed(() => {
    if (!selectedFile.value) return null
    return {
      name: selectedFile.value.name,
      size: formatFileSize(selectedFile.value.size)
    }
  })

  async function onFileSelected (file: File | null) {
    if (!file) {
      selectedFile.value = null
      previewUrl.value = null
      return
    }

    const error = validateImageFile(file)
    if (error) {
      quasar.notify({
        color: 'negative',
        message: error,
        icon: 'error',
        position: 'top'
      })
      selectedFile.value = null
      previewUrl.value = null
      return
    }

    try {
      isCompressing.value = true
      const compressedFile = await compressImage(file)
      selectedFile.value = compressedFile
      previewUrl.value = await createImagePreview(compressedFile)
    } catch {
      quasar.notify({
        color: 'negative',
        message: t('products.error_processing_image'),
        icon: 'error',
        position: 'top'
      })
      selectedFile.value = null
      previewUrl.value = null
    } finally {
      isCompressing.value = false
    }
  }

  function reset () {
    selectedFile.value = null
    previewUrl.value = null
  }

  return {
    selectedFile,
    previewUrl,
    isCompressing,
    fileInfo,
    onFileSelected,
    reset
  }
}
