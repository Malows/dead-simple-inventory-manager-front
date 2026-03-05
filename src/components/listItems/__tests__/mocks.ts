import type { Brand } from '../../../types/brand.interfaces'
import type { Category } from '../../../types/category.interfaces'
import type { Supplier } from '../../../types/supplier.interfaces'
import type { Product, ProductEntity } from '../../../types/product.interfaces'

// Mock product data
export const mockProducts: ProductEntity[] = [
  { id: 1, uuid: 'product-uuid-1', name: 'Product 1', code: 'PRD001', stock: 10, min_stock_warning: 5, price: 100, brand_id: 1, description: 'Test product 1', supplier_id: 1, image_url: 'https://example.com/image1.jpg' },
  { id: 2, uuid: 'product-uuid-2', name: 'Product 2', code: 'PRD002', stock: 20, min_stock_warning: 8, price: 200, brand_id: 1, description: 'Test product 2', supplier_id: 1, image_url: 'https://example.com/image2.jpg' },
  { id: 3, uuid: 'product-uuid-3', name: 'Product 3', code: 'PRD003', stock: 15, min_stock_warning: 6, price: 150, brand_id: 1, description: 'Test product 3', supplier_id: 1, image_url: 'https://example.com/image3.jpg' }
]

// Mock brand data
export const mockBrand: Brand = {
  id: 1,
  uuid: 'brand-uuid-123',
  name: 'Test Brand',
  created_at: new Date(),
  updated_at: new Date(),
  products: mockProducts
}

export const mockBrandNoProducts: Brand = {
  id: 2,
  uuid: 'brand-uuid-456',
  name: 'Empty Brand',
  created_at: new Date(),
  updated_at: new Date(),
  products: []
}

export const mockCategory: Category = {
  id: 1,
  uuid: 'category-uuid-123',
  name: 'Test Category',
  created_at: new Date(),
  updated_at: new Date(),
  products: mockProducts
}

export const mockCategoryNoProducts: Category = {
  id: 2,
  uuid: 'category-uuid-456',
  name: 'Empty Category',
  created_at: new Date(),
  updated_at: new Date(),
  products: []
}

export const mockSupplier: Supplier = {
  id: 1,
  uuid: 'supplier-uuid-123',
  name: 'Test Supplier',
  email: 'supplier@example.com',
  phone: '1234567890',
  address: 'Test Address',
  web: 'https://example.com',
  created_at: new Date(),
  updated_at: new Date(),
  products: mockProducts
}

export const mockSupplierNoProducts: Supplier = {
  id: 2,
  uuid: 'supplier-uuid-456',
  name: 'Empty Supplier',
  email: null,
  phone: null,
  address: null,
  web: null,
  created_at: new Date(),
  updated_at: new Date(),
  products: []
}

export const mockFullProduct: Product = {
  id: 1,
  uuid: 'product-uuid-123',
  name: 'Test Product',
  code: 'PROD-001',
  price: 100,
  stock: 50,
  min_stock_warning: 10,
  description: 'Test Description',
  brand_id: 1,
  supplier_id: 1,
  image_url: 'https://example.com/image.jpg',
  brand: { id: 1, uuid: 'brand-uuid-123', name: 'Test Brand' },
  supplier: { id: 1, uuid: 'supplier-uuid-123', name: 'Test Supplier', email: 'supplier@example.com', phone: '1234567890', address: 'Test Address', web: 'https://example.com' },
  categories: [],
  last_price_update: new Date('2024-01-01'),
  last_stock_update: new Date('2024-01-01'),
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null
}

export const mockLowStockProduct: Product = {
  ...mockFullProduct,
  id: 2,
  uuid: 'product-uuid-low-stock',
  stock: 5,
  min_stock_warning: 10
}

export const mockNoStockProduct: Product = {
  ...mockFullProduct,
  id: 3,
  uuid: 'product-uuid-no-stock',
  stock: 0,
  min_stock_warning: 10
}
