export default {
  operation: 'operación',
  operations: 'operaciones',
  Operation: '@.capitalize:operations.operation',
  Operations: '@.capitalize:operations.operations',

  // tabs
  stock: 'Stock',
  prices_by_group: 'Precios por grupo',

  // stepper
  step_movement_type: 'Tipo de movimiento',
  step_select_products: 'Seleccionar productos',
  step_review: 'Revisión',

  // stock movement types
  purchase: 'Compra',
  purchase_desc: 'Agregar productos recibidos de proveedores al inventario.',
  purchase_action: 'Aumenta stock',
  sale: 'Venta',
  sale_desc: 'Registrar productos vendidos a clientes.',
  sale_action: 'Disminuye stock',
  adjustment: 'Ajuste',
  adjustment_desc: 'Corregir discrepancias de stock encontradas durante auditorías o conteos.',
  adjustment_action: 'Establece stock exacto',
  return: 'Devolución',
  return_desc: 'Procesar productos devueltos por clientes de vuelta al inventario.',
  return_action: 'Aumenta stock',
  movement_type: 'Tipo de movimiento',

  // price adjustment types
  price_percentage: 'Porcentaje',
  price_fixed: 'Monto fijo',
  adjustment_type: 'Tipo de ajuste',

  // entity types
  entity_type: 'Tipo de entidad',
  by_brand: 'Por marca',
  by_supplier: 'Por proveedor',
  by_category: 'Por categoría',

  // labels
  value: 'Valor',
  quantity: 'Cantidad',
  available: 'Disponibles',
  selected: 'Seleccionados',
  select_entity: 'Seleccionar entidad',

  // actions
  execute: 'Ejecutar',
  apply: 'Aplicar',

  // hints
  hint_percentage: 'Ej: 10 incrementa 10%, -10 reduce 10%',
  hint_fixed: 'Ej: 50 incrementa $50, -50 reduce $50',

  // messages
  stock_updated: 'Stock actualizado exitosamente',
  error_stock: 'Error al actualizar stock',
  price_updated: 'Precios actualizados exitosamente',
  error_price: 'Error al actualizar precios',
  affected_resources: '{count} producto afectado | {count} productos afectados',

  // validations
  select_products: 'Seleccione al menos un producto',
  select_movement_type: 'Seleccione un tipo de movimiento',
  select_entity_type: 'Seleccione un tipo de entidad',
  select_adjustment_type: 'Seleccione un tipo de ajuste',
  select_entity_value: 'Seleccione una entidad',
  value_required: 'Ingrese un valor',
  quantity_required: 'La cantidad debe ser mayor a 0',
  quantity_min: 'La cantidad debe ser al menos {min}',
  quantity_max_stock: 'La cantidad no puede superar el stock actual',
  sold_quantity: 'Unidades vendidas',
  purchased_quantity: 'Unidades compradas',
  returned_quantity: 'Unidades devueltas',
  adjusted_quantity: 'Stock ajustado',
  no_products: 'No hay productos disponibles',

  // review
  review_movement_type: 'Tipo de movimiento',
  review_products: 'Productos a modificar',
  review_empty: 'No hay productos seleccionados',
  review_confirm: 'Confirmar y ejecutar',
  review_total_products: '{count} producto | {count} productos',

  // navigation
  next: 'Siguiente',
  back: 'Volver',

  // transfer list
  filter_by_name: 'Filtrar por nombre o código',
  no_results: 'Sin resultados'
}
