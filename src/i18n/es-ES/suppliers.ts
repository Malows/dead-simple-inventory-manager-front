export default {
  supplier: 'proveedor',
  suppliers: 'proveedores',
  Supplier: '@.capitalize:suppliers.supplier',
  Suppliers: '@.capitalize:suppliers.suppliers',
  count: 'sin @:suppliers.suppliers | un @:suppliers.supplier | {count} @:suppliers.suppliers',
  create: 'Crear @:suppliers.supplier',
  created: 'Nuevo @:suppliers.supplier creado',
  update: 'Editar @:suppliers.supplier',
  updated: '@:suppliers.Supplier actualizado',
  deleted: '@:suppliers.Supplier eliminado',
  show: 'Ver @:suppliers.supplier'
}
