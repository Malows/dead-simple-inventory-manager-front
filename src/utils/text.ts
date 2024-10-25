/**
 *
 * @param {*} source
 * @returns
 */
export function capitalize (source: string): string {
  return source.slice(0, 1).toUpperCase() + source.slice(1)
}

const moneyParse = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'USD',
  currencyDisplay: 'narrowSymbol'
})

/**
 *
 * @param {*} value
 * @returns
 */
export function parsePrice (value: number): string {
  return moneyParse.format(value)
}
