export default {
  supplier: 'proveedor',
  suppliers: 'proveedores',
  Supplier: '@.capitalize:suppliers.supplier',
  Suppliers: '@.capitalize:suppliers.suppliers',
  count: 'sin @:suppliers.suppliers | un @:suppliers.supplier | {count} @:suppliers.suppliers',

  // page titles
  create: 'Crear @:suppliers.supplier',
  update: 'Editar @:suppliers.supplier',
  show: 'Ver @:suppliers.supplier',

  // notify
  error_fetching: 'Error obteniendo todos los @:suppliers.suppliers',
  error_getting: 'Error obteniendo el @:suppliers.supplier',
  created: 'Nuevo @:suppliers.supplier creado',
  error_creating: 'Error creando @:suppliers.supplier',
  updated: '@:suppliers.Supplier actualizado',
  error_updating: 'Error actualizando @:suppliers.supplier',
  deleted: '@:suppliers.Supplier eliminado',
  error_deleting: 'Error eliminando @:suppliers.supplier',

  // dialogs titles
  confirm_delete: '¿Está seguro de que desea eliminar el @:suppliers.supplier {name}?',

  Address: 'Dirección',
  Phone: 'Teléfono',
  Email: 'Email',
  Web: 'Web'
}
