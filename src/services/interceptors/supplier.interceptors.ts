import { RawSupplier, Supplier } from 'src/types/supplier.interfaces'
import { mapModel } from './model.interceptors'

export function mapSupplier (raw: RawSupplier): Supplier {
  const products = raw.products ?? []
  return mapModel({ ...raw, products })
}
