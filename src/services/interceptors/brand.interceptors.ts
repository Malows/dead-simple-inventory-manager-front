import { RawBrand, Brand } from '../../types/brand.interfaces'
import { mapModel } from './model.interceptors'

export function mapBrand (raw: RawBrand): Brand {
  const products = raw.products ?? []
  return mapModel({ ...raw, products })
}
