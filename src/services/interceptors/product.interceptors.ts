import { Product, RawProduct } from '../../types/product.interfaces'
import { mapModel } from './model.interceptors'

export function mapProduct (raw: RawProduct): Product {
  const categories = raw.categories ?? []
  const supplier = raw.supplier ?? null
  return {
    ...mapModel({ ...raw, categories, supplier }),
    last_price_update: raw.last_price_update ? new Date(raw.last_price_update) : null,
    last_stock_update: raw.last_stock_update ? new Date(raw.last_stock_update) : null,
    deleted_at: raw.deleted_at ? new Date(raw.deleted_at) : null
  }
}
