<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuasar, QFile } from 'quasar'
import { useI18n } from 'vue-i18n'

import { useProductsStore } from '../../stores/products'
import { Product } from '../../types/product.interfaces'
import {
  validateImageFile,
  createImagePreview,
  compressImage,
  formatFileSize
} from '../../utils/image'

const { t } = useI18n()
const { product } = defineProps<{ product: Product }>()
const show = defineModel<boolean>({ default: false })

const productsStore = useProductsStore()
const quasar = useQuasar()

const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
const isCompressing = ref(false)
const cameraInput = ref<QFile | null>(null)

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

  // Validate file
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

  // Compress image
  try {
    isCompressing.value = true
    const compressedFile = await compressImage(file)
    selectedFile.value = compressedFile

    // Create preview
    previewUrl.value = await createImagePreview(compressedFile)
  } catch (err) {
    console.error('Error processing image:', err)
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

function openCamera () {
  cameraInput.value?.pickFiles()
}

async function uploadImage () {
  if (!selectedFile.value) return

  quasar.loading.show({
    message: t('products.uploading_photo')
  })

  try {
    const { isOk } = await productsStore.uploadProductImage(product.uuid, selectedFile.value)

    quasar.notify({
      color: isOk ? 'positive' : 'negative',
      message: isOk ? t('products.photo_uploaded') : t('products.error_uploading'),
      icon: isOk ? 'check_circle' : 'error',
      position: 'top'
    })

    if (isOk) {
      show.value = false
      selectedFile.value = null
      previewUrl.value = null
    }
  } catch (error) {
    console.error('Upload error:', error)
    quasar.notify({
      color: 'negative',
      message: t('products.error_uploading'),
      icon: 'error',
      position: 'top'
    })
  } finally {
    quasar.loading.hide()
  }
}
</script>

<template>
  <q-dialog v-model="show">
    <q-card style="min-width: 350px; max-width: 500px">
      <q-card-section>
        <div class="text-h6">
          {{ t("products.upload_photo") }}
        </div>
        <div class="text-caption text-grey-7">
          {{ product.name }}
        </div>
      </q-card-section>

      <q-card-section>
        <!-- File picker -->
        <q-file
          v-model="selectedFile"
          :label="t('products.choose_photo')"
          accept="image/*"
          clearable
          counter
          max-file-size="2097152"
          @update:model-value="onFileSelected"
        >
          <template #prepend>
            <q-icon name="attach_file" />
          </template>
          <template #hint>
            {{ t("products.accepted_formats") }}
          </template>
        </q-file>

        <!-- Camera button -->
        <q-btn
          flat
          color="primary"
          icon="photo_camera"
          :label="t('products.take_photo')"
          class="q-mt-md full-width"
          @click="openCamera"
        />

        <!-- Hidden camera input -->
        <q-file
          ref="cameraInput"
          v-model="selectedFile"
          accept="image/*"
          capture="environment"
          class="hidden"
          @update:model-value="onFileSelected"
        />

        <!-- Compression indicator -->
        <div v-if="isCompressing" class="q-mt-md text-center">
          <q-spinner color="primary" size="40px" />
          <div class="text-caption q-mt-sm">
            {{ t("products.compressing") }}
          </div>
        </div>

        <!-- Preview -->
        <div v-if="previewUrl && !isCompressing" class="q-mt-md">
          <div class="text-subtitle2 q-mb-sm">
            {{ t("products.preview") }}
          </div>
          <div class="preview-container">
            <q-img
              :src="previewUrl"
              style="max-height: 300px"
              fit="contain"
              spinner-color="primary"
              class="full-width rounded-borders"
            />
          </div>
          <div v-if="fileInfo" class="text-caption text-center text-grey-7 q-mt-sm">
            {{ fileInfo.name }} • {{ fileInfo.size }}
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn v-close-popup flat :label="t('common.cancel')" color="primary" />
        <q-btn
          flat
          :label="t('common.upload')"
          color="primary"
          icon="cloud_upload"
          :disable="!selectedFile || isCompressing"
          @click="uploadImage"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped>
.preview-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 16px;
  min-height: 200px;
}
</style>
