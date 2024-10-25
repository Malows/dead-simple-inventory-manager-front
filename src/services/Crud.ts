import Generic from './Generic'
import { CATEGORIES_URL, PRODUCTS_URL, SUPPLIERS_URL } from './api'
import { CategoryWithProducts, Product, SupplierWithProducts } from '../types'

class CategoryService extends Generic<CategoryWithProducts> {
  override _url = CATEGORIES_URL
}

class ProductService extends Generic<Product> {
  override _url = PRODUCTS_URL
}

class SupplierService extends Generic<SupplierWithProducts> {
  override _url = SUPPLIERS_URL
}

export const categoryService = new CategoryService()
export const productService = new ProductService()
export const supplierService = new SupplierService()
