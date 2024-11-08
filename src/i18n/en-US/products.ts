export default {
  product: 'product',
  products: 'products',
  Product: '@.capitalize:products.product',
  Products: '@.capitalize:products.products',
  count: 'no @:products.products | one @:products.product | {count} @:products.products',

  // page titles
  create: 'Create @:products.product',
  update: 'Update @:products.product',
  show: 'Show @:products.product',

  // notify
  error_fetching: 'Error getting all the @:products.products',
  error_getting: 'Error getting the @:products.product',
  created: 'New @:products.product created',
  error_creating: 'Error creating @:products.product',
  updated: '@products.Product updated',
  error_updating: 'Error updating @:products.product',
  deleted: '@products.Product deleted',
  error_deleting: 'Error deleting @:products.product',
  stock_reduced: 'Stock reduced',
  error_reducing_stock: 'Error reducing stock',

  // dialogs titles
  confirm_delete: 'Are you sure you want to delete the @:products.product {name} ({code})?',
  reduce_stock: 'Reduce stock units',

  Code: 'Code',
  Price: 'Price',
  Description: 'Description',
  stock: 'Stock',
  lower_stock_warning: 'Minimum stock allowed',
  available_stock: 'Available stock {stock}',
  insufficient_stock: 'Insufficient stock',
  reduce: 'Reduce'
}
