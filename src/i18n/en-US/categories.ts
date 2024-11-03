export default {
  category: 'category',
  categories: 'categories',
  Category: '@.capitalize:categories.category',
  Categories: '@.capitalize:categories.categories',
  count: 'no @:categories.categories | one @:categories.category | {count} @:categories.categories',
  create: 'Create @:categories.category',
  created: 'New @:categories.category created',
  error_creating: 'Error creating @:categories.category',
  update: 'Update @:categories.category',
  updated: '@:categories.Category updated',
  error_updating: 'Error updating @:categories.category',
  deleted: '@:categories.Category deleted',
  show: 'Show @:categories.category'
}
