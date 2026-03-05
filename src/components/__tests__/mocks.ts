import type { Product } from '../../types/product.interfaces'

// Mock product data
export const mockProducts: Product[] = [
  {
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
  },
  {
    id: 2,
    uuid: 'product-uuid-456',
    name: 'Another Product',
    code: 'PROD-002',
    price: 200,
    stock: 20,
    min_stock_warning: 5,
    description: 'Another Description',
    brand_id: 2,
    supplier_id: 2,
    image_url: null,
    brand: null,
    supplier: null,
    categories: [],
    last_price_update: null,
    last_stock_update: null,
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null
  }
]

export const mockProduct = mockProducts[0]
