import Generic from './Generic'
import { BRANDS_URL, CATEGORIES_URL, PRODUCTS_URL, STORAGE_LOCATIONS_URL, SUPPLIERS_URL } from './api'
import { RawBrand } from 'src/types/brand.interfaces'
import { RawSupplier } from 'src/types/supplier.interfaces'
import { RawProduct } from 'src/types/product.interfaces'
import { RawCategory } from 'src/types/category.interfaces'
import { RawStorageLocation } from 'src/types/storage-location.interfaces'
import HttpResponse, { handle } from './Response'

class BrandService extends Generic<RawBrand> {
  override _url = BRANDS_URL
}

class CategoryService extends Generic<RawCategory> {
  override _url = CATEGORIES_URL
}

class ProductService extends Generic<RawProduct> {
  override _url = PRODUCTS_URL

  /**
   * Upload an image for a product
   * @param uuid - Product UUID
   * @param file - Image file to upload
   * @returns Promise resolving to the updated product
   */
  uploadImage (uuid: string, file: File): Promise<HttpResponse<RawProduct>> {
    const formData = new FormData()
    formData.append('image', file)

    return handle<RawProduct>(
      fetch(`${this.url(uuid)}/image`, {
        headers: this.authFileHeader(),
        method: 'POST',
        body: formData
      })
    )
  }
}

class SupplierService extends Generic<RawSupplier> {
  override _url = SUPPLIERS_URL
}

class StorageLocationService extends Generic<RawStorageLocation> {
  override _url = STORAGE_LOCATIONS_URL
}

export const brandService = new BrandService()
export const categoryService = new CategoryService()
export const productService = new ProductService()
export const supplierService = new SupplierService()
export const storageLocationService = new StorageLocationService()
