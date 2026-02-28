export default {
  brand: 'brand',
  brands: 'brands',
  Brand: '@.capitalize:brands.brand',
  Brands: '@.capitalize:brands.brands',
  count: 'no @:brands.brands | one @:brands.brand | {count} @:brands.brands',

  // page titles
  create: 'Create @:brands.brand',
  update: 'Update @:brands.brand',
  show: 'Show @:brands.brand',

  // notify
  error_fetching: 'Error getting all the @:brands.catoregies',
  error_getting: 'Error getting the @:brands.catoregy',
  created: 'New @:brands.brand created',
  error_creating: 'Error creating @:brands.brand',
  updated: '@:brands.Brand updated',
  error_updating: 'Error updating @:brands.brand',
  deleted: '@:brands.Brand deleted',
  error_deleting: 'Error deleting @:brands.brand',

  // dialogs titles
  confirm_delete: 'Are you sure you want to delete the @brands.brand {name}?'
}
