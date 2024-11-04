export default {
  product: 'product',
  products: 'products',
  Product: '@.capitalize:products.product',
  Products: '@.capitalize:products.products',
  count: 'no @:products.products | one @:products.product | {count} @:products.products',
  create: 'Create @:products.product',
  created: 'New @:products.product created',
  error_creating: 'Error creating @:products.product',
  update: 'Update @:products.product',
  updated: '@products.Product updated',
  error_updating: 'Error updating @:products.product',
  deleted: '@products.Product deleted',
  show: 'Show @:products.product',
  Code: 'Code',
  Price: 'Price',
  Description: 'Description',
  lower_stock_warning: 'Minimum stock allowed'
}
