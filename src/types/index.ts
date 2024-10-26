import { RouteLocationRaw } from 'vue-router'

export type SelectOption<T> = { label: string, value: T }
export type WithId<T> = T & { id: number | string }
export interface Link {
  to: RouteLocationRaw,
  label: string,
  icon?: string,
}
