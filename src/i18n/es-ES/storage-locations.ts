export default {
  storage_location: 'ubicacion de almacenamiento',
  storage_locations: 'ubicaciones de almacenamiento',
  StorageLocation: '@.capitalize:storage_locations.storage_location',
  StorageLocations: '@.capitalize:storage_locations.storage_locations',
  count: 'sin @:storage_locations.storage_locations | una @:storage_locations.storage_location | {count} @:storage_locations.storage_locations',

  // page titles
  create: 'Crear @:storage_locations.storage_location',
  update: 'Editar @:storage_locations.storage_location',
  show: 'Ver @:storage_locations.storage_location',

  // notify
  error_fetching: 'Error obteniendo todas las @:storage_locations.storage_locations',
  error_getting: 'Error obteniendo la @:storage_locations.storage_location',
  created: 'Nueva @:storage_locations.storage_location creada',
  error_creating: 'Error creando @:storage_locations.storage_location',
  updated: '@:storage_locations.StorageLocation actualizada',
  error_updating: 'Error editando @:storage_locations.storage_location',
  deleted: '@:storage_locations.StorageLocation eliminada',
  error_deleting: 'Error eliminando @:storage_locations.storage_location',

  // dialogs
  confirm_delete: '¿Está seguro de que desea eliminar la @:storage_locations.storage_location {name}?',

  Description: 'Descripción'
}
