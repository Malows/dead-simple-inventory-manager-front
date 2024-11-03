export default {
  product: 'producto',
  products: 'productos',
  Product: '@.capitalize:products.product',
  Products: '@.capitalize:products.products',
  count: 'sin @:products.products | un @:products.product | {count} @:products.products',
  create: 'Crear @:products.product',
  created: 'Nuevo @:products.product creado',
  update: 'Editar @:products.product',
  updated: '@:products.Product actualizado',
  deleted: '@:products.Product eliminado',
  show: 'Ver @:products.product'
}
