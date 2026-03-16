import type { BrandEntity } from './brand.interfaces'
import type { CategoryEntity } from './category.interfaces'
import type { StorageLocationEntity } from './storage-location.interfaces'
import type { SupplierEntity } from './supplier.interfaces'

export interface ProductDTO {
  name: string;
  code: string;
  stock: number;
  min_stock_warning: number;
  description: string | null;
  price: number | null;
  brand_id: number | null;
  supplier_id: number | null;
  storage_location_id: number | null;
  categories?: number[];
  image_url?: string | null;
}

export interface ProductEntity {
  id: number;
  uuid: string;
  name: string;
  code: string;
  stock: number;
  min_stock_warning: number;
  description: string | null;
  price: number | null;
  brand_id: number | null;
  supplier_id: number | null;
  storage_location_id: number | null;
  image_url: string | null;
}

export interface RawProduct extends ProductEntity {
  supplier?: SupplierEntity | null;
  brand?: BrandEntity | null;
  storage_location?: StorageLocationEntity | null;
  categories?: CategoryEntity[] | null;
  last_price_update: string | null;
  last_stock_update: string | null;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
}

export interface Product extends ProductEntity {
  brand: BrandEntity | null;
  supplier: SupplierEntity | null;
  storage_location: StorageLocationEntity | null;
  categories: CategoryEntity[];
  last_price_update: Date | null;
  last_stock_update: Date | null;
  created_at: Date | null;
  updated_at: Date | null;
  deleted_at: Date | null;
}
