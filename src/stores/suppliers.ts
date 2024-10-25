import { ref } from 'vue'
import { defineStore } from 'pinia'
import { SupplierWithProducts } from '../types'
import { supplierService } from '../services/Crud'

export const useSuppliersStore = defineStore('suppliers', () => {
  const suppliersRequest = ref({ idle: true, fetching: false })
  const suppliers = ref<SupplierWithProducts[]>([])

  async function request<T> (promise: Promise<T>) {
    suppliersRequest.value = { idle: false, fetching: true }
    const response = await promise
    suppliersRequest.value = { idle: false, fetching: false }

    return response
  }

  async function getSuppliers () {
    const response = await request(supplierService.fetch())

    if (response.data) {
      suppliers.value = response.data
    }

    return response
  }

  async function getSupplier (supplier: SupplierWithProducts) {
    const response = await request(supplierService.get(supplier.uuid))

    if (response.data) {
      const index = suppliers.value.findIndex((s) => s.uuid === supplier.uuid)

      if (index !== -1) {
        suppliers.value.splice(index, 1, response.data)
      } else {
        suppliers.value.push(response.data)
      }
    }

    return response
  }

  async function createSupplier (supplier: SupplierWithProducts) {
    const response = await request(supplierService.create(supplier))

    if (response.data) {
      suppliers.value.push(response.data)
    }

    return response
  }

  async function updateSupplier (supplier: SupplierWithProducts) {
    const response = await request(supplierService.update(supplier.uuid, supplier))

    if (response.data) {
      const index = suppliers.value.findIndex((s) => s.uuid === supplier.uuid)

      if (index !== -1) {
        suppliers.value.splice(index, 1, response.data)
      } else {
        suppliers.value.push(response.data)
      }
    }

    return response
  }

  async function deleteSupplier (supplier: SupplierWithProducts) {
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
    suppliersRequest,

    getSuppliers,
    getSupplier,
    createSupplier,
    updateSupplier,
    deleteSupplier
  }
})
