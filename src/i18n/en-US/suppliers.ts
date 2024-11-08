export default {
  supplier: 'supplier',
  suppliers: 'suppliers',
  Supplier: '@.capitalize:suppliers.supplier',
  Suppliers: '@.capitalize:suppliers.suppliers',
  count: 'no @:suppliers.suppliers | one @:suppliers.supplier | {count} @:suppliers.suppliers',

  // page titles
  create: 'Create @:suppliers.supplier',
  update: 'Update @:suppliers.supplier',
  show: 'Show @:suppliers.supplier',

  // notify
  error_fetching: 'Error getting all the @:suppliers.suppliers',
  error_getting: 'Error getting the @:suppliers.supplier',
  created: 'New @:suppliers.supplier created',
  error_creating: 'Error creating @:suppliers.supplier',
  updated: '@:suppliers.Supplier updated',
  error_updating: 'Error updating @:suppliers.supplier',
  deleted: '@:suppliers.Supplier deleted',
  error_deleting: 'Error deleting @:suppliers.supplier',

  // dialogs titles
  confirm_delete: 'Are you sure you want to delete the @suppliers.supplier {name}?',

  Address: 'Address',
  Phone: 'Phone',
  Email: 'Email',
  Web: 'Web'
}
