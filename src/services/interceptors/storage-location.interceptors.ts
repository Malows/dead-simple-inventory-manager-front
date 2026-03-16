import { RawStorageLocation, StorageLocation } from '../../types/storage-location.interfaces'
import { mapModel } from './model.interceptors'

export function mapStorageLocation (raw: RawStorageLocation): StorageLocation {
  const products = raw.products ?? []
  return mapModel({ ...raw, products })
}
