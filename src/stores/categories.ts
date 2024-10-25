import { ref } from 'vue'
import { defineStore } from 'pinia'
import { CategoryWithProducts } from '../types'
import { categoryService } from '../services/Crud'

export const useCategoriesStore = defineStore('categories', () => {
  const categoriesRequest = ref({ idle: true, fetching: false })
  const categories = ref<CategoryWithProducts[]>([])

  async function request<T> (promise: Promise<T>) {
    categoriesRequest.value = { idle: false, fetching: true }
    const response = await promise
    categoriesRequest.value = { idle: false, fetching: false }

    return response
  }

  async function getCategories () {
    const response = await request(categoryService.fetch())

    if (response.data) {
      categories.value = response.data
    }

    return response
  }

  async function getCategory (category: CategoryWithProducts) {
    const response = await request(categoryService.get(category.uuid))

    if (response.data) {
      const index = categories.value.findIndex((c) => c.uuid === category.uuid)

      if (index !== -1) {
        categories.value.splice(index, 1, response.data)
      } else {
        categories.value.push(response.data)
      }
    }

    return response
  }

  async function createCategory (category: CategoryWithProducts) {
    const response = await request(categoryService.create(category))

    if (response.data) {
      categories.value.push(response.data)
    }

    return response
  }

  async function updateCategory (category: CategoryWithProducts) {
    const response = await request(categoryService.update(category.uuid, category))

    if (response.data) {
      const index = categories.value.findIndex((c) => c.uuid === category.uuid)

      if (index !== -1) {
        categories.value.splice(index, 1, response.data)
      } else {
        categories.value.push(response.data)
      }
    }

    return response
  }

  async function deleteCategory (category: CategoryWithProducts) {
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
    categoriesRequest,

    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
  }
})
