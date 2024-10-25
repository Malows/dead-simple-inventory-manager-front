export interface Model {
  id: number,
  uuid: string,
  created_at: Date | null,
  updated_at: Date | null,
}

export interface User extends Model {
  name: string,
  email: string,
}

export interface Category extends Model {
  name: string,
}

export interface Supplier extends Model {
  name: string,
  email: string | null,
  phone: string | null,
  address: string | null,
  web: string | null,
}

export interface Product extends Model {
  name: string,
  code: string,
  stock: number,
  min_stock_warning: number,
  description: string | null,
  price: number | null,
  supplier_id: number | null,
  supplier?: Supplier | null,
  categories?: Category[] | null,
}

export interface SupplierWithProducts extends Supplier {
  products?: Product[],
}

export interface CategoryWithProducts extends Category {
  products?: Product[],
}
