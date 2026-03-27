import type { ProductEntity } from './product.interfaces'

export interface StorageLocationDTO {
  name: string;
  description: string | null;
}

export interface StorageLocationEntity extends StorageLocationDTO {
  id: number;
  uuid: string;
}

export interface RawStorageLocation extends StorageLocationEntity {
  created_at: string | null;
  updated_at: string | null;
  products?: ProductEntity[] | null;
}

export interface StorageLocation extends StorageLocationEntity {
  created_at: Date | null;
  updated_at: Date | null;
  products: ProductEntity[];
}
