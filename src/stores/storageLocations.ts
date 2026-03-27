import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import { storageLocationService } from '../services/Crud'
import { mapStorageLocation } from '../services/interceptors/storage-location.interceptors'
import { StorageLocation, StorageLocationDTO } from '../types/storage-location.interfaces'
import { SelectOption } from '../types'
import { useRequests } from '../composition/useRequests'
import { useCacheStore } from './cache.store'

export const useStorageLocationsStore = defineStore('storageLocations', () => {
  const cache = useCacheStore()
  const storageLocations = ref<StorageLocation[]>([])

  const { requestStatus, request } = useRequests()

  async function getStorageLocations () {
    const notEmpty = storageLocations.value.length > 0
    const notIdle = !requestStatus.value.idle

    if (notIdle && notEmpty && !cache.getAllStorageLocations) {
      return
    }

    const response = await request(storageLocationService.fetch())

    if (response.data) {
      storageLocations.value = response.data.map(mapStorageLocation)
      cache.flushStorageLocations()
    }

    return response
  }

  async function getStorageLocation (uuid: string) {
    const response = await request(storageLocationService.get(uuid))

    if (response.data) {
      const index = storageLocations.value.findIndex((storageLocation: StorageLocation) => storageLocation.uuid === uuid)

      const storageLocation = mapStorageLocation(response.data)

      if (index !== -1) {
        storageLocations.value.splice(index, 1, storageLocation)
      } else {
        storageLocations.value.push(storageLocation)
      }

      cache.flushStorageLocations(storageLocation.uuid)
    }

    return response
  }

  async function createStorageLocation (payload: StorageLocationDTO) {
    const response = await request(storageLocationService.create(payload))

    if (response.data) {
      storageLocations.value.push(mapStorageLocation(response.data))
    }

    return response
  }

  async function updateStorageLocation (payload: StorageLocation) {
    const response = await request(storageLocationService.update(payload.uuid, payload))

    if (response.data) {
      const index = storageLocations.value.findIndex((s) => s.uuid === payload.uuid)

      const storageLocation = mapStorageLocation(response.data)

      if (index !== -1) {
        storageLocations.value.splice(index, 1, storageLocation)
      } else {
        storageLocations.value.push(storageLocation)
      }

      cache.flushStorageLocations(storageLocation.uuid)
    }

    return response
  }

  async function deleteStorageLocation (storageLocation: StorageLocation) {
    const response = await request(storageLocationService.remove(storageLocation.uuid))

    if (response.data) {
      const index = storageLocations.value.findIndex((s) => s.uuid === storageLocation.uuid)

      if (index !== -1) {
        storageLocations.value.splice(index, 1)
        cache.flushStorageLocations(storageLocation.uuid)
      }
    }

    return response
  }

  const storageLocationsOptions = computed(() =>
    storageLocations.value.map((storageLocation) => ({
      label: storageLocation.name,
      value: storageLocation.id
    }) as SelectOption<number>)
  )

  return {
    storageLocations,
    storageLocationsRequest: requestStatus,
    storageLocationsOptions,

    getStorageLocations,
    getStorageLocation,
    createStorageLocation,
    updateStorageLocation,
    deleteStorageLocation
  }
})
