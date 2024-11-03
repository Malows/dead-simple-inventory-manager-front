export default {
  product: 'product',
  products: 'products',
  Product: '@.capitalize:products.product',
  Products: '@.capitalize:products.products',
  count: 'no @:products.products | one @:products.product | {count} @:products.products',
  create: 'Create @:products.product',
  created: 'New @:products.product created',
  update: 'Update @:products.product',
  updated: '@products.Product updated',
  deleted: '@products.Product deleted',
  show: 'Show @:products.product'
}
