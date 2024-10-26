import { ref } from 'vue'
import { defineStore } from 'pinia'

import { supplierService } from '../services/Crud'
import { mapSupplier } from '../services/interceptors/supplier.interceptors'
import { Supplier } from '../types/supplier.interfaces'
import { useRequests } from '../composition/useRequests'

export const useSuppliersStore = defineStore('suppliers', () => {
  const suppliers = ref<Supplier[]>([])

  const { requestStatus, request } = useRequests()

  async function getSuppliers () {
    const response = await request(supplierService.fetch())

    if (response.data) {
      suppliers.value = response.data.map(mapSupplier)
    }

    return response
  }

  async function getSupplier (supplier: Supplier) {
    const response = await request(supplierService.get(supplier.uuid))

    if (response.data) {
      const index = suppliers.value.findIndex((s) => s.uuid === supplier.uuid)

      if (index !== -1) {
        suppliers.value.splice(index, 1, mapSupplier(response.data))
      } else {
        suppliers.value.push(mapSupplier(response.data))
      }
    }

    return response
  }

  async function createSupplier (supplier: Supplier) {
    const response = await request(supplierService.create(supplier))

    if (response.data) {
      suppliers.value.push(mapSupplier(response.data))
    }

    return response
  }

  async function updateSupplier (supplier: Supplier) {
    const response = await request(supplierService.update(supplier.uuid, supplier))

    if (response.data) {
      const index = suppliers.value.findIndex((s) => s.uuid === supplier.uuid)

      if (index !== -1) {
        suppliers.value.splice(index, 1, mapSupplier(response.data))
      } else {
        suppliers.value.push(mapSupplier(response.data))
      }
    }

    return response
  }

  async function deleteSupplier (supplier: Supplier) {
    const response = await request(supplierService.remove(supplier.uuid))

    if (response.data) {
      const index = suppliers.value.findIndex((s) => s.uuid === supplier.uuid)

      if (index !== -1) {
        suppliers.value.splice(index, 1)
      }
    }

    return response
  }

  return {
    suppliers,
    suppliersRequest: requestStatus,

    getSuppliers,
    getSupplier,
    createSupplier,
    updateSupplier,
    deleteSupplier
  }
})
