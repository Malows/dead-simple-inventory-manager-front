import {
  parse,
  parseJSON,
  format,
  isDate
} from 'date-fns'

const regionalDateFormat = 'dd/MM/yyyy'

/**
 *
 * @param {*} input
 * @returns
 */
export function toPlainString (input: string | Date): string {
  if (!input) {
    return ''
  }

  const date = isDate(input) ? input : parseJSON(input)

  return format(date, regionalDateFormat)
}

/**
 *
 * @param {*} input
 * @returns
 */
export function fromPlainString (input: string): Date | null {
  if (!input) {
    return null
  }

  return parse(input, regionalDateFormat, new Date())
}

/**
 *
 * @param {*} input
 * @returns
 */
export function filterDate (input: string): Date | null {
  const dateFormat = /\d{2}.\d{2}.\d{4}/

  return dateFormat.exec(input)
    ? parse(input, regionalDateFormat, new Date())
    : null
}
