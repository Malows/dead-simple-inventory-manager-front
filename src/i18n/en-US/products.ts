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
  photo_uploaded: 'Photo uploaded successfully',
  error_uploading: 'Error uploading photo',
  error_processing_image: 'Error processing image',
  uploading_photo: 'Uploading photo...',

  // dialogs titles
  confirm_delete: 'Are you sure you want to delete the @:products.product {name} ({code})?',
  reduce_stock: 'Reduce stock units',
  upload_photo: 'Upload product photo',

  // photo dialog
  choose_photo: 'Choose from device',
  take_photo: 'Take photo',
  accepted_formats: 'JPG, PNG or WebP (max. 2MB)',
  preview: 'Preview',
  compressing: 'Compressing image...',

  Code: 'Code',
  Price: 'Price',
  Description: 'Description',
  stock: 'Stock',
  lower_stock_warning: 'Minimum stock allowed',
  available_stock: 'Available stock {stock}',
  insufficient_stock: 'Insufficient stock',
  reduce: 'Reduce'
}
