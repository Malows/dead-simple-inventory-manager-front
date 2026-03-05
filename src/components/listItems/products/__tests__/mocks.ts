import { Product } from '../../../../types/product.interfaces'

export const mockProduct: Product = {
  id: 1,
  uuid: 'product-uuid-123',
  name: 'Test Product',
  code: 'PROD-001',
  price: 100,
  stock: 50,
  created_at: new Date(),
  updated_at: new Date(),
  last_stock_update: new Date('2024-01-01'),
  last_price_update: new Date(),
  image_url: 'https://example.com/image.jpg',
  brand: { id: 1, uuid: 'brand-uuid-123', name: 'Test Brand' },
  brand_id: 1,
  supplier: { id: 1, uuid: 'supplier-uuid-123', name: 'Test Supplier', email: 'supplier@example.com', phone: '1234567890', address: 'Test Address', web: 'https://example.com' },
  supplier_id: 1,
  categories: [],
  deleted_at: null,
  description: 'Test Description',
  min_stock_warning: 10
}

export const mockProductNoUpdate: Product = {
  ...mockProduct,
  last_stock_update: null
}

export const mockProductNoPrice: Product = {
  ...mockProduct,
  price: null
}

export const mockProductNoCode: Product = {
  ...mockProduct,
  code: ''
}

export const mockProductNoImage: Product = {
  ...mockProduct,
  image_url: null
}

export const mockProductNoPriceUpdate: Product = {
  ...mockProduct,
  last_price_update: null
}
