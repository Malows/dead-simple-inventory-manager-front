export default {
  category: 'category',
  categories: 'categories',
  Category: '@.capitalize:categories.category',
  Categories: '@.capitalize:categories.categories',
  count: 'no @:categories.categories | one @:categories.category | {count} @:categories.categories',

  // page titles
  create: 'Create @:categories.category',
  update: 'Update @:categories.category',
  show: 'Show @:categories.category',

  // notify
  created: 'New @:categories.category created',
  error_creating: 'Error creating @:categories.category',
  updated: '@:categories.Category updated',
  error_updating: 'Error updating @:categories.category',
  deleted: '@:categories.Category deleted',
  error_deleting: 'Error deleting @:categories.category',

  // dialogs titles
  confirm_delete: 'Are you sure you want to delete the @categories.category {name}?'
}
