import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import { brandService } from '../services/Crud'
import { mapBrand } from '../services/interceptors/brand.interceptors'
import { Brand, BrandDTO } from '../types/brand.interfaces'
import { SelectOption } from '../types'
import { useRequests } from '../composition/useRequests'
import { useCacheStore } from './cache.store'

export const useBrandsStore = defineStore('brands', () => {
  const cache = useCacheStore()
  const brands = ref<Brand[]>([])

  const { requestStatus, request } = useRequests()

  async function getBrands () {
    const notEmpty = brands.value.length > 0
    const notIdle = !requestStatus.value.idle

    if (notIdle && notEmpty && !cache.getAllBrands) {
      return
    }

    const response = await request(brandService.fetch())

    if (response.data) {
      brands.value = response.data.map(mapBrand)
      cache.flushBrands()
    }

    return response
  }

  async function getBrand (uuid: string) {
    const response = await request(brandService.get(uuid))

    if (response.data) {
      const index = brands.value.findIndex((brand: Brand) => brand.uuid === uuid)

      const brand = mapBrand(response.data)

      if (index !== -1) {
        brands.value.splice(index, 1, brand)
      } else {
        brands.value.push(brand)
      }

      cache.flushBrands(brand.uuid)
    }

    return response
  }

  async function createBrand (payload: BrandDTO) {
    const response = await request(brandService.create(payload))

    if (response.data) {
      brands.value.push(mapBrand(response.data))
    }

    return response
  }

  async function updateBrand (payload: Brand) {
    const response = await request(brandService.update(payload.uuid, payload))

    if (response.data) {
      const index = brands.value.findIndex((s) => s.uuid === payload.uuid)

      const brand = mapBrand(response.data)

      if (index !== -1) {
        brands.value.splice(index, 1, brand)
      } else {
        brands.value.push(brand)
      }

      cache.flushBrands(brand.uuid)
    }

    return response
  }

  async function deleteBrand (brand: Brand) {
    const response = await request(brandService.remove(brand.uuid))

    if (response.data) {
      const index = brands.value.findIndex((s) => s.uuid === brand.uuid)

      if (index !== -1) {
        brands.value.splice(index, 1)
        cache.flushBrands(brand.uuid)
      }
    }

    return response
  }

  const brandsOptions = computed(() => brands.value.map((brand) => ({ label: brand.name, value: brand.id }) as SelectOption<number>))

  return {
    brands,
    brandsRequest: requestStatus,
    brandsOptions,

    getBrands,
    getBrand,
    createBrand,
    updateBrand,
    deleteBrand
  }
})
