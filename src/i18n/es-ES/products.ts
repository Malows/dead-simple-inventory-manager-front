export default {
  product: 'producto',
  products: 'productos',
  Product: '@.capitalize:products.product',
  Products: '@.capitalize:products.products',
  count: 'sin @:products.products | un @:products.product | {count} @:products.products',
  create: 'Crear @:products.product',
  created: 'Nuevo @:products.product creado',
  error_creating: 'Error creando @:products.product',
  update: 'Editar @:products.product',
  updated: '@:products.Product actualizado',
  error_updating: 'Error editando @:products.product',
  deleted: '@:products.Product eliminado',
  show: 'Ver @:products.product',
  Code: 'Código',
  Price: 'Precio',
  Description: 'Descripción',
  lower_stock_warning: 'Advertencia de stock bajo'
}
