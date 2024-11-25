import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCacheStore = defineStore('cache', () => {
  const products = ref<Set<string>>(new Set())
  const categories = ref<Set<string>>(new Set())
  const suppliers = ref<Set<string>>(new Set())

  const getAllCategories = computed(() => categories.value.has('all'))
  const getAllProducts = computed(() => products.value.has('all'))
  const getAllSuppliers = computed(() => suppliers.value.has('all'))

  const flushCategories = (uuid?: string) => {
    if (!uuid) {
      categories.value.clear()
      return true
    } else {
      return categories.value.delete(uuid)
    }
  }

  const flushProducts = (uuid?: string) => {
    if (!uuid) {
      products.value.clear()
      return true
    } else {
      return products.value.delete(uuid)
    }
  }

  const flushSuppliers = (uuid?: string) => {
    if (!uuid) {
      suppliers.value.clear()
      return true
    } else {
      return suppliers.value.delete(uuid)
    }
  }

  return {
    products,
    categories,
    suppliers,

    getAllCategories,
    getAllProducts,
    getAllSuppliers,

    flushCategories,
    flushProducts,
    flushSuppliers
  }
})
