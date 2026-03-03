export default {
  operation: 'operación',
  operations: 'operaciones',
  Operation: '@.capitalize:operations.operation',
  Operations: '@.capitalize:operations.operations',

  // tabs
  stock: 'Stock',
  prices_by_group: 'Precios por grupo',

  // stock movement types
  purchase: 'Compra',
  sale: 'Venta',
  adjustment: 'Ajuste',
  return: 'Devolución',
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
  no_products: 'No hay productos disponibles',

  // transfer list
  filter_by_name: 'Filtrar por nombre o código',
  no_results: 'Sin resultados'
}
