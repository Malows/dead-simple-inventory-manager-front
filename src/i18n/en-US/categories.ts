export default {
  category: 'category',
  categories: 'categories',
  Category: '@.capitalize:categories.category',
  Categories: '@.capitalize:categories.categories',
  count: 'no @:categories.categories | one @:categories.category | {count} @:categories.categories',
  create: 'Create @:categories.category',
  created: 'New @:categories.category created',
  update: 'Update @:categories.category',
  updated: '@:categories.Category updated',
  deleted: '@:categories.Category deleted',
  show: 'Show @:categories.category'
}
