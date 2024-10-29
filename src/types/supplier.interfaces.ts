import { ProductEntity } from './product.interfaces'

export interface SupplierDTO {
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  web: string | null;
}

export interface SupplierEntity extends SupplierDTO {
  id: number;
  uuid: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  web: string | null;
}

export interface RawSupplier extends SupplierEntity {
  created_at: string | null;
  updated_at: string | null;
  products?: ProductEntity[] | null;
}

export interface Supplier extends SupplierEntity {
  created_at: Date | null;
  updated_at: Date | null;
  products: ProductEntity[];
}
