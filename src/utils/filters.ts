/**
 *
 * @param {*} object
 * @param {*} keys
 * @returns
 */
function only (object: Record<string, string>, keys: string[]): string[] {
  return keys.map(x => (object[x]).toLowerCase())
}

/**
 *
 * @param {*} searchInput
 * @param {*} searchFields
 * @returns
 */
function compare (searchInput: string, searchFields: string[]) {
  const toSearch = searchInput.toLowerCase()

  return (x: Record<string, string>) => {
    return only(x, searchFields).some(value => value?.includes(toSearch))
  }
}

/**
 *
 * @param {*} searchField
 * @returns
 */
export function byName (searchField: string) {
  return compare(searchField, ['name'])
}

/**
 *
 * @param {*} searchField
 * @returns
 */
export function byProduct (searchField: string) {
  return compare(searchField, ['name', 'code'])
}
