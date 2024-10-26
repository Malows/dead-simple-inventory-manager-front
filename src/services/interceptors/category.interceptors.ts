import { RawCategory, Category } from 'src/types/category.interfaces'
import { mapModel } from './model.interceptors'

export function mapCategory (raw: RawCategory): Category {
  const products = raw.products ?? []
  return mapModel({ ...raw, products })
}
