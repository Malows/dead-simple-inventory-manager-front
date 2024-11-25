import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import { supplierService } from '../services/Crud'
import { mapSupplier } from '../services/interceptors/supplier.interceptors'
import { Supplier, SupplierDTO } from '../types/supplier.interfaces'
import { SelectOption } from '../types'
import { useRequests } from '../composition/useRequests'
import { useCacheStore } from './cache.store'

export const useSuppliersStore = defineStore('suppliers', () => {
  const cache = useCacheStore()
  const suppliers = ref<Supplier[]>([])

  const { requestStatus, request } = useRequests()

  async function getSuppliers () {
    const notEmpty = suppliers.value.length > 0
    const notIdle = !requestStatus.value.idle

    if (notIdle && notEmpty && !cache.getAllSuppliers) {
      return
    }

    const response = await request(supplierService.fetch())

    if (response.data) {
      suppliers.value = response.data.map(mapSupplier)
      cache.flushSuppliers()
    }

    return response
  }

  async function getSupplier (uuid: string) {
    const response = await request(supplierService.get(uuid))

    if (response.data) {
      const index = suppliers.value.findIndex((supplier: Supplier) => supplier.uuid === uuid)

      const supplier = mapSupplier(response.data)

      if (index !== -1) {
        suppliers.value.splice(index, 1, supplier)
      } else {
        suppliers.value.push(supplier)
      }

      cache.flushSuppliers(supplier.uuid)
    }

    return response
  }

  async function createSupplier (payload: SupplierDTO) {
    const response = await request(supplierService.create(payload))

    if (response.data) {
      suppliers.value.push(mapSupplier(response.data))
    }

    return response
  }

  async function updateSupplier (payload: Supplier) {
    const response = await request(supplierService.update(payload.uuid, payload))

    if (response.data) {
      const index = suppliers.value.findIndex((s) => s.uuid === payload.uuid)

      const supplier = mapSupplier(response.data)

      if (index !== -1) {
        suppliers.value.splice(index, 1, supplier)
      } else {
        suppliers.value.push(supplier)
      }

      cache.flushSuppliers(supplier.uuid)
    }

    return response
  }

  async function deleteSupplier (supplier: Supplier) {
    const response = await request(supplierService.remove(supplier.uuid))

    if (response.data) {
      const index = suppliers.value.findIndex((s) => s.uuid === supplier.uuid)

      if (index !== -1) {
        suppliers.value.splice(index, 1)
        cache.flushSuppliers(supplier.uuid)
      }
    }

    return response
  }

  const suppliersOptions = computed(() => suppliers.value.map((supplier) => ({ label: supplier.name, value: supplier.id }) as SelectOption<number>))

  return {
    suppliers,
    suppliersRequest: requestStatus,
    suppliersOptions,

    getSuppliers,
    getSupplier,
    createSupplier,
    updateSupplier,
    deleteSupplier
  }
})
