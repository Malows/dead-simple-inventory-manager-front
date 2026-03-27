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
  photo_uploaded: 'Foto subida exitosamente',
  error_uploading: 'Error al subir la foto',
  error_processing_image: 'Error al procesar la imagen',
  uploading_photo: 'Subiendo foto...',

  // dialogs titles
  confirm_delete: '¿Está seguro de que desea eliminar el @:products.product {name} ({code})?',
  reduce_stock: 'Restar unidades de stock',
  upload_photo: 'Subir foto del producto',

  // photo dialog
  choose_photo: 'Elegir del dispositivo',
  take_photo: 'Tomar foto',
  accepted_formats: 'JPG, PNG o WebP (máx. 2MB)',
  preview: 'Vista previa',
  compressing: 'Comprimiendo imagen...',

  Code: 'Código',
  Price: 'Precio',
  Description: 'Descripción',
  lower_stock_warning: 'Advertencia de stock bajo',
  stock: 'Stock',
  available_stock: 'Stock disponible {stock}',
  insufficient_stock: 'No existe suficiente stock',
  reduce: 'Restar'
}
