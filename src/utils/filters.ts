import { Product } from '../types/product.interfaces'

/**
 *
 * @param {*} searchField
 * @returns
 */
export function byName (searchField: string) {
  const toSearch = searchField.toLowerCase()
  return (x: { name: string }) => x.name.toLowerCase().includes(toSearch)
}

/**
 *
 * @param {*} searchField
 * @returns
 */
export function byProduct (searchField: string) {
  const toSearch = searchField.toLowerCase()

  return ({ name, code }: Product) =>
    name.toLowerCase().includes(toSearch) || code.toLowerCase().includes(toSearch)
}

/**
 * Advanced filter for products with text, brand, supplier, and category filters
 */
export function byProductAdvanced (
  searchField: string,
  brandId: number | null,
  supplierId: number | null,
  categoryId: number | null
) {
  const textFilter = searchField ? byProduct(searchField) : null

  return (product: Product) => {
    if (textFilter && !textFilter(product)) return false
    if (brandId !== null && product.brand_id !== brandId) return false
    if (supplierId !== null && product.supplier_id !== supplierId) return false
    if (categoryId !== null && !product.categories?.some((c) => c.id === categoryId)) return false
    return true
  }
}
