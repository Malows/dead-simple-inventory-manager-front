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

  return ({ name, code }: Product) => name.toLowerCase().includes(toSearch) || code.toLowerCase().includes(toSearch)
}
