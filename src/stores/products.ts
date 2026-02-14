import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { Decimal } from 'decimal.js'

import { productService } from '../services/Crud'
import { mapProduct } from '../services/interceptors/product.interceptors'
import { Product, ProductDTO } from '../types/product.interfaces'
import { useRequests } from '../composition/useRequests'
import { useCacheStore } from './cache.store'

function sumAllMoney (products: Product[]) {
  const sum = products.reduce((acc, product) => {
    return (!product.stock || !product.price)
      ? acc
      : acc.add(new Decimal(product.price).times(product.stock))
  }, new Decimal(0))

  return sum.toNumber()
}

export const useProductsStore = defineStore('products', () => {
  const cache = useCacheStore()
  const products = ref<Product[]>([])

  const { requestStatus, request } = useRequests()

  async function forceGetProducts () {
    const response = await request(productService.fetch())

    if (response.data) {
      products.value = response.data.map(mapProduct)
      cache.flushProducts()
    }

    return response
  }

  async function getProducts () {
    const notEmpty = products.value.length > 0
    const notIdle = !requestStatus.value.idle

    if (notIdle && notEmpty && !cache.getAllProducts) {
      return
    }

    return forceGetProducts()
  }

  async function getProduct (uuid: string) {
    const response = await request(productService.get(uuid))

    if (response.data) {
      const index = products.value.findIndex((product) => product.uuid === uuid)

      const product = mapProduct(response.data)

      if (index !== -1) {
        products.value.splice(index, 1, product)
      } else {
        products.value.push(product)
      }

      cache.flushProducts(product.uuid)
    }

    return response
  }

  async function createProduct (payload: ProductDTO) {
    const response = await request(productService.create(payload))

    if (response.data) {
      const product = mapProduct(response.data)
      products.value.push(product)
      cache.flushProducts(product.uuid)
    }

    return response
  }

  async function updateProduct (payload: ProductDTO & { uuid: string }) {
    const response = await request(productService.update(payload.uuid, payload))

    if (response.data) {
      const index = products.value.findIndex((c) => c.uuid === payload.uuid)

      const product = mapProduct(response.data)

      if (index !== -1) {
        products.value.splice(index, 1, product)
      } else {
        products.value.push(mapProduct(response.data))
      }

      cache.flushProducts(product.uuid)
    }

    return response
  }

  async function uploadProductImage (uuid: string, file: File) {
    const response = await request(productService.uploadImage(uuid, file))

    if (response.data) {
      const index = products.value.findIndex((c) => c.uuid === uuid)

      const product = mapProduct(response.data)

      if (index !== -1) {
        products.value.splice(index, 1, product)
      } else {
        products.value.push(product)
      }

      cache.flushProducts(product.uuid)
    }

    return response
  }

  async function deleteProduct (product: Product) {
    const response = await request(productService.remove(product.uuid))

    if (response.data) {
      const index = products.value.findIndex((c) => c.uuid === product.uuid)

      if (index !== -1) {
        products.value.splice(index, 1)
        cache.flushProducts(product.uuid)
      }
    }

    return response
  }

  const moneyInvested = computed(() => sumAllMoney(products.value))

  return {
    products,
    productsRequest: requestStatus,

    forceGetProducts,
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    uploadProductImage,
    deleteProduct,

    moneyInvested
  }
})
