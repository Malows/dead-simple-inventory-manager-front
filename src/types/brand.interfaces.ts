import { ProductEntity } from './product.interfaces'

export interface BrandDTO {
  name: string;
}

export interface BrandEntity extends BrandDTO {
  id: number;
  uuid: string;
}

export interface RawBrand extends BrandEntity {
  created_at: string | null;
  updated_at: string | null;
  products?: ProductEntity[] | null;
}

export interface Brand extends BrandEntity {
  created_at: Date | null;
  updated_at: Date | null;
  products: ProductEntity[];
}
