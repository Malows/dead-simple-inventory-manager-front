export default {
  category: 'categoría',
  categories: 'categorías',
  Category: '@.capitalize:categories.category',
  Categories: '@.capitalize:categories.categories',
  count: 'sin @:categories.categories | una @:categories.category | {count} @:categories.categories',

  // page titles
  create: 'Crear @:categories.category',
  update: 'Editar @:categories.category',
  show: 'Ver @:categories.category',

  // notify
  error_fetching: 'Error obteniendo todas las @:categories.categories',
  error_getting: 'Error obteniendo la @:categories.category',
  created: 'Nueva @:categories.category creada',
  error_creating: 'Error creando @:categories.category',
  updated: '@:categories.Category actualizada',
  error_updating: 'Error editando @:categories.category',
  deleted: '@:categories.Category eliminada',
  error_deleting: 'Error eliminando @:categories.category',

  // dialogs titles
  confirm_delete: '¿Está seguro de que desea eliminar la @categories.category {name}?'
}
