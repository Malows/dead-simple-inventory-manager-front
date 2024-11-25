import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import { categoryService } from '../services/Crud'
import { mapCategory } from '../services/interceptors/category.interceptors'
import { Category, CategoryDTO } from '../types/category.interfaces'
import { SelectOption } from '../types'
import { useRequests } from '../composition/useRequests'
import { useCacheStore } from './cache.store'

export const useCategoriesStore = defineStore('categories', () => {
  const cache = useCacheStore()
  const categories = ref<Category[]>([])

  const { requestStatus, request } = useRequests()

  async function getCategories () {
    const notEmpty = categories.value.length > 0
    const notIdle = !requestStatus.value.idle

    if (notIdle && notEmpty && !cache.getAllCategories) {
      return
    }

    const response = await request(categoryService.fetch())

    if (response.data) {
      categories.value = response.data.map(mapCategory)
      cache.flushCategories()
    }

    return response
  }

  async function getCategory (uuid: string) {
    const response = await request(categoryService.get(uuid))

    if (response.data) {
      const index = categories.value.findIndex((category: Category) => category.uuid === uuid)

      const data = mapCategory(response.data)

      if (index !== -1) {
        categories.value.splice(index, 1, data)
      } else {
        categories.value.push(data)
      }

      cache.flushCategories(data.uuid)
    }

    return response
  }

  async function createCategory (payload: CategoryDTO) {
    const response = await request(categoryService.create(payload))

    if (response.data) {
      const category = mapCategory(response.data)
      categories.value.push(category)
      cache.flushCategories(category.uuid)
    }

    return response
  }

  async function updateCategory (category: Category) {
    const response = await request(categoryService.update(category.uuid, category))

    if (response.data) {
      const index = categories.value.findIndex((c) => c.uuid === category.uuid)

      const data = mapCategory(response.data)

      if (index !== -1) {
        categories.value.splice(index, 1, data)
      } else {
        categories.value.push(data)
      }

      cache.flushCategories(data.uuid)
    }

    return response
  }

  async function deleteCategory (category: Category) {
    const response = await request(categoryService.remove(category.uuid))

    if (response.data) {
      const index = categories.value.findIndex((c) => c.uuid === category.uuid)

      if (index !== -1) {
        categories.value.splice(index, 1)
        cache.flushCategories(category.uuid)
      }
    }

    return response
  }

  const categoriesMap = computed(() => new Map(categories.value.map((category) => [category.id, category])))
  const categoriesOptions = computed(() => categories.value.map((category) => ({ label: category.name, value: category.id }) as SelectOption<number>))

  return {
    categories,
    categoriesRequest: requestStatus,
    categoriesMap,
    categoriesOptions,

    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
  }
})
