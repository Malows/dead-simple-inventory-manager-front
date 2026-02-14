import Generic from './Generic'
import { BRANDS_URL, CATEGORIES_URL, PRODUCTS_URL, SUPPLIERS_URL } from './api'
import { RawBrand } from 'src/types/brand.interfaces'
import { RawSupplier } from 'src/types/supplier.interfaces'
import { RawProduct } from 'src/types/product.interfaces'
import { RawCategory } from 'src/types/category.interfaces'

class BrandService extends Generic<RawBrand> {
  override _url = BRANDS_URL
}

class CategoryService extends Generic<RawCategory> {
  override _url = CATEGORIES_URL
}

class ProductService extends Generic<RawProduct> {
  override _url = PRODUCTS_URL
}

class SupplierService extends Generic<RawSupplier> {
  override _url = SUPPLIERS_URL
}

export const brandService = new BrandService()
export const categoryService = new CategoryService()
export const productService = new ProductService()
export const supplierService = new SupplierService()
