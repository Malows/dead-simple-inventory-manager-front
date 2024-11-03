export default {
  supplier: 'supplier',
  suppliers: 'suppliers',
  Supplier: '@.capitalize:suppliers.supplier',
  Suppliers: '@.capitalize:suppliers.suppliers',
  count: 'no @:suppliers.suppliers | one @:suppliers.supplier | {count} @:suppliers.suppliers',
  create: 'Create @:suppliers.supplier',
  created: 'New @:suppliers.supplier created',
  update: 'Update @:suppliers.supplier',
  updated: '@:suppliers.Supplier updated',
  deleted: '@:suppliers.Supplier deleted',
  show: 'Show @:suppliers.supplier'
}
