import type { Model, RawModel } from '../../types/model.interfaces'

export function mapModel<T extends RawModel> (raw: T): T & Model {
  return {
    ...raw,
    created_at: raw.created_at ? new Date(raw.created_at) : null,
    updated_at: raw.updated_at ? new Date(raw.updated_at) : null
  }
}
