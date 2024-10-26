import { Product, RawProduct } from '../../types/product.interfaces'
import { mapModel } from './model.interceptors'

export function mapProduct (raw: RawProduct): Product {
  const categories = raw.categories ?? []
  const supplier = raw.supplier ?? null
  return mapModel({ ...raw, categories, supplier })
}
