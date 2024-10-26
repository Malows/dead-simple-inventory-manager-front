import Generic from './Generic'
import { CATEGORIES_URL, PRODUCTS_URL, SUPPLIERS_URL } from './api'
import { RawSupplier } from 'src/types/supplier.interfaces'
import { RawProduct } from 'src/types/product.interfaces'
import { RawCategory } from 'src/types/category.interfaces'

class CategoryService extends Generic<RawCategory> {
  override _url = CATEGORIES_URL
}

class ProductService extends Generic<RawProduct> {
  override _url = PRODUCTS_URL
}

class SupplierService extends Generic<RawSupplier> {
  override _url = SUPPLIERS_URL
}

export const categoryService = new CategoryService()
export const productService = new ProductService()
export const supplierService = new SupplierService()
