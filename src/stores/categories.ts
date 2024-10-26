import { ref } from 'vue'
import { defineStore } from 'pinia'

import { categoryService } from '../services/Crud'
import { mapCategory } from '../services/interceptors/category.interceptors'
import { Category, CategoryDTO } from '../types/category.interfaces'
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

  async function getCategory (category: Category) {
    const response = await request(categoryService.get(category.uuid))

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

  return {
    categories,
    categoriesRequest: requestStatus,

    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
  }
})
