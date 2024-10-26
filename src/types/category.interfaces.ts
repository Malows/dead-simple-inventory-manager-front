import { ProductEntity } from './product.interfaces'

export interface CategoryDTO {
  name: string;
}

export interface CategoryEntity extends CategoryDTO {
  id: number;
  uuid: string;
}

export interface RawCategory extends CategoryEntity {
  created_at: string | null;
  updated_at: string | null;
  products?: ProductEntity[] | null;
}

export interface Category extends CategoryEntity {
  created_at: Date | null;
  updated_at: Date | null;
  products: ProductEntity[];
}
