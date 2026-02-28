export default {
  brand: 'marca',
  brands: 'marcas',
  Brand: '@.capitalize:brands.brand',
  Brands: '@.capitalize:brands.brands',
  count: 'sin @:brands.brands | una @:brands.brand | {count} @:brands.brands',

  // page titles
  create: 'Crear @:brands.brand',
  update: 'Editar @:brands.brand',
  show: 'Ver @:brands.brand',

  // notify
  error_fetching: 'Error obteniendo todas las @:brands.brands',
  error_getting: 'Error obteniendo la @:brands.brand',
  created: 'Nueva @:brands.brand creada',
  error_creating: 'Error creando @:brands.brand',
  updated: '@:brands.Brand actualizada',
  error_updating: 'Error editando @:brands.brand',
  deleted: '@:brands.Brand eliminada',
  error_deleting: 'Error eliminando @:brands.brand',

  // dialogs titles
  confirm_delete: '¿Está seguro de que desea eliminar la @:brands.brand {name}?'
}
