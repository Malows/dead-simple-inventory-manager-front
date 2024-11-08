export default {
  product: 'producto',
  products: 'productos',
  Product: '@.capitalize:products.product',
  Products: '@.capitalize:products.products',
  count: 'sin @:products.products | un @:products.product | {count} @:products.products',

  // page titles
  create: 'Crear @:products.product',
  update: 'Editar @:products.product',
  show: 'Ver @:products.product',

  // notify
  error_fetching: 'Error obteniendo todos los @:products.products',
  error_getting: 'Error obteniendo el @:products.product',
  created: 'Nuevo @:products.product creado',
  error_creating: 'Error creando @:products.product',
  updated: '@:products.Product actualizado',
  error_updating: 'Error editando @:products.product',
  deleted: '@:products.Product eliminado',
  error_deleting: 'Error eliminando @:products.product',
  stock_reduced: 'Stock reducido',
  error_reducing_stock: 'Error al restar stock',

  // dialogs titles
  confirm_delete: '¿Está seguro de que desea eliminar el @products.product {name} ({code})?',
  reduce_stock: 'Restar unidades de stock',

  Code: 'Código',
  Price: 'Precio',
  Description: 'Descripción',
  lower_stock_warning: 'Advertencia de stock bajo',
  stock: 'Stock',
  available_stock: 'Stock disponible {stock}',
  insufficient_stock: 'No existe suficiente stock',
  reduce: 'Restar'
}
