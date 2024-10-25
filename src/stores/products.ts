import { ref } from 'vue'
import { defineStore } from 'pinia'
import { Product } from '../types'
import { productService } from '../services/Crud'

export const useProductsStore = defineStore('products', () => {
  const productsRequest = ref({ idle: true, fetching: false })
  const products = ref<Product[]>([])

  async function request<T> (promise: Promise<T>) {
    productsRequest.value = { idle: false, fetching: true }
    const response = await promise
    productsRequest.value = { idle: false, fetching: false }

    return response
  }

  async function getProducts () {
    const response = await request(productService.fetch())

    if (response.data) {
      products.value = response.data
    }

    return response
  }

  async function getProduct (product: Product) {
    const response = await request(productService.get(product.uuid))

    if (response.data) {
      const index = products.value.findIndex((p) => p.uuid === product.uuid)

      if (index !== -1) {
        products.value.splice(index, 1, response.data)
      } else {
        products.value.push(response.data)
      }
    }

    return response
  }

  async function createProduct (product: Product) {
    const response = await request(productService.create(product))

    if (response.data) {
      products.value.push(response.data)
    }

    return response
  }

  async function updateProduct (product: Product) {
    const response = await request(productService.update(product.uuid, product))

    if (response.data) {
      const index = products.value.findIndex((c) => c.uuid === product.uuid)

      if (index !== -1) {
        products.value.splice(index, 1, response.data)
      } else {
        products.value.push(response.data)
      }
    }

    return response
  }

  async function deleteProduct (product: Product) {
    const response = await request(productService.remove(product.uuid))

    if (response.data) {
      const index = products.value.findIndex((c) => c.uuid === product.uuid)

      if (index !== -1) {
        products.value.splice(index, 1)
      }
    }

    return response
  }

  return {
    products,
    productsRequest,

    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
  }
})
