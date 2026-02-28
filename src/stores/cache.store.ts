import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCacheStore = defineStore('cache', () => {
  const brands = ref<Set<string>>(new Set())
  const categories = ref<Set<string>>(new Set())
  const products = ref<Set<string>>(new Set())
  const suppliers = ref<Set<string>>(new Set())

  const getAllBrands = computed(() => brands.value.has('all'))
  const getAllCategories = computed(() => categories.value.has('all'))
  const getAllProducts = computed(() => products.value.has('all'))
  const getAllSuppliers = computed(() => suppliers.value.has('all'))

  const flushBrands = (uuid?: string) => {
    if (!uuid) {
      brands.value.clear()
      return true
    } else {
      return brands.value.delete(uuid)
    }
  }

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
    brands,
    getAllCategories,
    getAllProducts,
    getAllSuppliers,
    getAllBrands,

    flushCategories,
    flushProducts,
    flushSuppliers,
    flushBrands
  }
})
