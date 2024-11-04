export default {
  supplier: 'supplier',
  suppliers: 'suppliers',
  Supplier: '@.capitalize:suppliers.supplier',
  Suppliers: '@.capitalize:suppliers.suppliers',
  count: 'no @:suppliers.suppliers | one @:suppliers.supplier | {count} @:suppliers.suppliers',
  create: 'Create @:suppliers.supplier',
  created: 'New @:suppliers.supplier created',
  error_creating: 'Error creating @:suppliers.supplier',
  update: 'Update @:suppliers.supplier',
  updated: '@:suppliers.Supplier updated',
  error_updating: 'Error updating @:suppliers.supplier',
  deleted: '@:suppliers.Supplier deleted',
  show: 'Show @:suppliers.supplier',
  Address: 'Address',
  Phone: 'Phone',
  Email: 'Email',
  Web: 'Web'
}
