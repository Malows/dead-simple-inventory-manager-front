export default {
  operation: 'operation',
  operations: 'operations',
  Operation: '@.capitalize:operations.operation',
  Operations: '@.capitalize:operations.operations',

  // tabs
  stock: 'Stock',
  prices_by_group: 'Prices by group',

  // stepper
  step_movement_type: 'Movement type',
  step_select_products: 'Select products',
  step_review: 'Review',

  // stock movement types
  purchase: 'Purchase',
  purchase_desc: 'Add products received from suppliers into inventory.',
  purchase_action: 'Increases stock',
  sale: 'Sale',
  sale_desc: 'Register products sold to customers.',
  sale_action: 'Decreases stock',
  adjustment: 'Adjustment',
  adjustment_desc: 'Correct stock discrepancies found during audits or counts.',
  adjustment_action: 'Sets exact stock',
  return: 'Return',
  return_desc: 'Process products returned by customers back into inventory.',
  return_action: 'Increases stock',
  movement_type: 'Movement type',

  // price adjustment types
  price_percentage: 'Percentage',
  price_fixed: 'Fixed amount',
  adjustment_type: 'Adjustment type',

  // entity types
  entity_type: 'Entity type',
  by_brand: 'By brand',
  by_supplier: 'By supplier',
  by_category: 'By category',

  // labels
  value: 'Value',
  quantity: 'Quantity',
  available: 'Available',
  selected: 'Selected',
  select_entity: 'Select an entity',

  // actions
  execute: 'Execute',
  apply: 'Apply',

  // hints
  hint_percentage: 'E.g.: 10 increases 10%, -10 decreases 10%',
  hint_fixed: 'E.g.: 50 increases $50, -50 decreases $50',

  // messages
  stock_updated: 'Stock updated successfully',
  error_stock: 'Error updating stock',
  price_updated: 'Prices updated successfully',
  error_price: 'Error updating prices',
  affected_resources: '{count} product affected | {count} products affected',

  // validations
  select_products: 'Select at least one product',
  select_movement_type: 'Select a movement type',
  select_entity_type: 'Select an entity type',
  select_adjustment_type: 'Select an adjustment type',
  select_entity_value: 'Select an entity',
  value_required: 'Enter a value',
  quantity_required: 'Quantity must be greater than 0',
  no_products: 'No products available',

  // review
  review_movement_type: 'Movement type',
  review_products: 'Products to modify',
  review_empty: 'No products selected',
  review_confirm: 'Confirm and execute',
  review_total_products: '{count} product | {count} products',

  // navigation
  next: 'Next',
  back: 'Back',

  // transfer list
  filter_by_name: 'Filter by name or code',
  no_results: 'No results'
}
