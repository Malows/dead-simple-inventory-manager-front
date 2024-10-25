import Generic from './Generic'
import { CATEGORIES_URL, PRODUCTS_URL, SUPPLIERS_URL } from './api'
import { Category, Product, Supplier } from '../types'

class CategoryService extends Generic<Category> {
  override _idProperty = 'uuid'

  override _url = CATEGORIES_URL
}

class ProductService extends Generic<Product> {
  override _idProperty = 'uuid'

  override _url = PRODUCTS_URL
}

class SupplierService extends Generic<Supplier> {
  override _idProperty = 'uuid'

  override _url = SUPPLIERS_URL
}

export const categoryService = new CategoryService()
export const productService = new ProductService()
export const supplierService = new SupplierService()
