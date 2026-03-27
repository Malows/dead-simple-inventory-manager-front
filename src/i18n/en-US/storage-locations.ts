export default {
  storage_location: 'storage location',
  storage_locations: 'storage locations',
  StorageLocation: '@.capitalize:storage_locations.storage_location',
  StorageLocations: '@.capitalize:storage_locations.storage_locations',
  count: 'no @:storage_locations.storage_locations | one @:storage_locations.storage_location | {count} @:storage_locations.storage_locations',

  // page titles
  create: 'Create @:storage_locations.storage_location',
  update: 'Update @:storage_locations.storage_location',
  show: 'Show @:storage_locations.storage_location',

  // notify
  error_fetching: 'Error getting all @:storage_locations.storage_locations',
  error_getting: 'Error getting the @:storage_locations.storage_location',
  created: 'New @:storage_locations.storage_location created',
  error_creating: 'Error creating @:storage_locations.storage_location',
  updated: '@:storage_locations.StorageLocation updated',
  error_updating: 'Error updating @:storage_locations.storage_location',
  deleted: '@:storage_locations.StorageLocation deleted',
  error_deleting: 'Error deleting @:storage_locations.storage_location',

  // dialogs
  confirm_delete: 'Are you sure you want to delete the @:storage_locations.storage_location {name}?',

  Description: 'Description'
}
