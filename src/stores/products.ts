import { ref } from 'vue'
import { defineStore } from 'pinia'

import { productService } from '../services/Crud'
import { mapProduct } from '../services/interceptors/product.interceptors'
import { Product, ProductDTO } from '../types/product.interfaces'
import { useRequests } from '../composition/useRequests'

export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>([])

  const { requestStatus, request } = useRequests()

  async function getProducts () {
    const response = await request(productService.fetch())

    if (response.data) {
      products.value = response.data.map(mapProduct)
    }

    return response
  }

  async function getProduct (product: Product) {
    const response = await request(productService.get(product.uuid))

    if (response.data) {
      const index = products.value.findIndex((p) => p.uuid === product.uuid)

      if (index !== -1) {
        products.value.splice(index, 1, mapProduct(response.data))
      } else {
        products.value.push(mapProduct(response.data))
      }
    }

    return response
  }

  async function createProduct (product: ProductDTO) {
    const response = await request(productService.create(product))

    if (response.data) {
      products.value.push(mapProduct(response.data))
    }

    return response
  }

  async function updateProduct (product: Product) {
    const response = await request(productService.update(product.uuid, product))

    if (response.data) {
      const index = products.value.findIndex((c) => c.uuid === product.uuid)

      if (index !== -1) {
        products.value.splice(index, 1, mapProduct(response.data))
      } else {
        products.value.push(mapProduct(response.data))
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
    productsRequest: requestStatus,

    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
  }
})
