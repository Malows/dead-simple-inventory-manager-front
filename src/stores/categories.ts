import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import { categoryService } from '../services/Crud'
import { mapCategory } from '../services/interceptors/category.interceptors'
import { Category, CategoryDTO } from '../types/category.interfaces'
import { SelectOption } from '../types'
import { useRequests } from '../composition/useRequests'

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref<Category[]>([])

  const { requestStatus, request } = useRequests()

  async function getCategories () {
    const response = await request(categoryService.fetch())

    if (response.data) {
      categories.value = response.data.map(mapCategory)
    }

    return response
  }

  async function getCategory (uuid: string) {
    const response = await request(categoryService.get(uuid))

    if (response.data) {
      const index = categories.value.findIndex((category: Category) => category.uuid === uuid)

      if (index !== -1) {
        categories.value.splice(index, 1, mapCategory(response.data))
      } else {
        categories.value.push(mapCategory(response.data))
      }
    }

    return response
  }

  async function createCategory (category: CategoryDTO) {
    const response = await request(categoryService.create(category))

    if (response.data) {
      categories.value.push(mapCategory(response.data))
    }

    return response
  }

  async function updateCategory (category: Category) {
    const response = await request(categoryService.update(category.uuid, category))

    if (response.data) {
      const index = categories.value.findIndex((c) => c.uuid === category.uuid)

      if (index !== -1) {
        categories.value.splice(index, 1, mapCategory(response.data))
      } else {
        categories.value.push(mapCategory(response.data))
      }
    }

    return response
  }

  async function deleteCategory (category: Category) {
    const response = await request(categoryService.remove(category.uuid))

    if (response.data) {
      const index = categories.value.findIndex((c) => c.uuid === category.uuid)

      if (index !== -1) {
        categories.value.splice(index, 1)
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
