# AGENTS.md - Dead Simple Inventory Manager Frontend

This document provides coding guidelines and commands for agentic coding assistants working on this Quasar Vue.js TypeScript project.

## Build, Lint, and Test Commands

### Development Workflow
```bash
# Start development server with hot reload
pnpm run dev
# or
quasar dev

# Build for production
pnpm run build
# or
quasar build

# Type checking
pnpm run check
# or
vue-tsc --noEmit
```

### Code Quality
```bash
# Lint all files
pnpm run lint
# or
eslint --ext .js,.ts,.vue ./

# Auto-fix linting issues
pnpm run lint:fix
# or
eslint --ext .js,.ts,.vue ./ --fix

# Format code (Rust-based formatter)
pnpm run fmt
# or
oxfmt
```

### Testing
```bash
# Run all tests once
pnpm run test
# or
vitest run

# Run tests in watch mode
pnpm run test:watch
# or
vitest

# Run tests with coverage report
pnpm run test:coverage
# or
vitest run --coverage

# Run a single test file
vitest run path/to/file.test.ts

# Run tests for a specific pattern
vitest run --reporter=verbose "**/stores/**"
```

### Coverage Requirements
- Lines: 80%
- Functions: 80%
- Branches: 80%
- Statements: 80%

## Code Style Guidelines

### File Organization
```
src/
├── components/     # Reusable Vue components
├── pages/         # Page components (routes)
├── layouts/       # Layout components
├── stores/        # Pinia stores
├── services/      # API and business logic services
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
├── composition/   # Vue composition functions
├── constants.ts   # Application constants
├── router/        # Vue router configuration
├── i18n/          # Internationalization files
└── boot/          # Quasar boot files
```

### Naming Conventions

#### Files and Directories
- Use PascalCase for Vue components: `ProductForm.vue`, `MainLayout.vue`
- Use camelCase for utility files: `useRequests.ts`, `formatDate.ts`
- Use kebab-case for page directories: `products/`, `create-page.vue`
- Store files: `products.ts`, `useProductsStore.ts`
- Test files: `component.test.ts`, `service.spec.ts`

#### Variables and Functions
- camelCase for variables, functions, and methods: `userName`, `getProducts()`
- PascalCase for types, interfaces, classes: `ProductDTO`, `UserInterface`
- SCREAMING_SNAKE_CASE for constants: `API_BASE_URL`, `DEFAULT_TIMEOUT`
- Prefix boolean variables with `is`, `has`, `can`: `isLoading`, `hasError`

### Vue Components

#### Component Structure
```vue
<script setup lang="ts">
// 1. Imports (external libraries first, then internal)
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

import { useProductsStore } from '@/stores/products'

// 2. Type imports
import type { Product } from '@/types/product.interface'

// 3. Component logic
const props = defineProps<{
  productId: number
}>()

const emit = defineEmits<{
  update: [product: Product]
}>()

// Use defineModel for v-model support
const searchQuery = defineModel<string>('search', { default: '' })

// Reactive data
const products = ref<Product[]>([])
const isLoading = ref(false)

// Computed properties
const filteredProducts = computed(() => {
  return products.value.filter(product =>
    product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// Methods
const fetchProducts = async () => {
  isLoading.value = true
  try {
    await productsStore.getProducts()
  } catch (error) {
    console.error('Failed to fetch products:', error)
  } finally {
    isLoading.value = false
  }
}

// Lifecycle hooks
onMounted(() => {
  fetchProducts()
})
</script>

<template>
  <!-- Template content -->
</template>

<style scoped>
/* Component styles */
</style>
```

#### Component Patterns
- Use `<script setup lang="ts">` syntax for Vue 3
- Define props and emits with TypeScript types
- Use `defineModel` for two-way binding (v-model)
- Group imports: external → internal → types
- Use composition API over options API
- Handle loading states and error cases
- Use i18n for all user-facing strings

### TypeScript Usage

#### Type Definitions
```typescript
// Interface for API responses
export interface Product {
  id: number
  uuid: string
  name: string
  code: string
  price: number
  stock: number
  created_at: string
  updated_at: string
}

// Generic response wrapper
export interface ApiResponse<T> {
  data: T
  message: string
  isOk: boolean
  code: number
  error: string | null
}

// Utility types
export type ProductForm = Omit<Product, 'id' | 'uuid' | 'created_at' | 'updated_at'>
export type PartialProduct = Partial<Product>
```

#### Type Safety
- Use strict mode (enabled in tsconfig.json)
- Avoid `any` type - use proper interfaces
- Use union types for variant values: `status: 'active' | 'inactive' | 'archived'`
- Leverage TypeScript's inference capabilities
- Use `Record<string, unknown>` instead of `{ [key: string]: any }`

### Pinia Stores

#### Store Structure
```typescript
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import { productService } from '@/services/Crud'
import { useRequests } from '@/composition/useRequests'

export const useProductsStore = defineStore('products', () => {
  // State
  const products = ref<Product[]>([])
  const selectedProduct = ref<Product | null>(null)

  // Composition
  const { requestStatus, request } = useRequests()

  // Getters (computed)
  const activeProducts = computed(() =>
    products.value.filter(product => product.status === 'active')
  )

  const totalValue = computed(() =>
    products.value.reduce((sum, product) => sum + product.price * product.stock, 0)
  )

  // Actions
  async function getProducts() {
    const response = await request(productService.fetch())

    if (response.data) {
      products.value = response.data
    }

    return response
  }

  async function createProduct(productData: ProductForm) {
    const response = await request(productService.create(productData))

    if (response.data) {
      products.value.push(response.data)
    }

    return response
  }

  async function updateProduct(uuid: string, updates: Partial<Product>) {
    const response = await request(productService.update(uuid, updates))

    if (response.data) {
      const index = products.value.findIndex(p => p.uuid === uuid)
      if (index !== -1) {
        products.value[index] = response.data
      }
    }

    return response
  }

  return {
    // State
    products,
    selectedProduct,

    // Getters
    activeProducts,
    totalValue,

    // Actions
    getProducts,
    createProduct,
    updateProduct
  }
})
```

#### Store Patterns
- Use composition API stores
- Group state, getters, and actions clearly
- Use `useRequests` composition for API calls
- Handle optimistic updates where appropriate
- Return all public API from the store

### Testing Conventions

#### Test File Structure
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProductsStore } from '../products'

// Mock dependencies
vi.mock('../../services/Crud', () => ({
  productService: {
    fetch: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn()
  }
}))

import { productService } from '../../services/Crud'

describe('useProductsStore', () => {
  let store: ReturnType<typeof useProductsStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useProductsStore()
    vi.clearAllMocks()
  })

  describe('getProducts', () => {
    it('should fetch and set products', async () => {
      const mockProducts = [{ id: 1, name: 'Test Product' }]
      productService.fetch.mockResolvedValue({
        isOk: true,
        data: mockProducts
      })

      await store.getProducts()

      expect(productService.fetch).toHaveBeenCalled()
      expect(store.products).toEqual(mockProducts)
    })

    it('should handle errors gracefully', async () => {
      productService.fetch.mockResolvedValue({
        isOk: false,
        error: 'Network error'
      })

      const result = await store.getProducts()

      expect(result.isOk).toBe(false)
      expect(store.products).toEqual([])
    })
  })
})
```

#### Testing Patterns
- Use Vitest with globals enabled
- Mock external dependencies (services, API calls)
- Test both success and error scenarios
- Use descriptive test names and `describe` blocks
- Test computed properties and reactive behavior
- Aim for high coverage across all branches

### Import/Export Patterns

#### Import Order
```typescript
// 1. External libraries (Vue, Quasar, third-party)
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Notify } from 'quasar'

// 2. Internal modules (use path aliases)
import { useProductsStore } from '@/stores/products'
import { productService } from '@/services/Crud'
import ProductForm from '@/components/ProductForm.vue'

// 3. Type imports
import type { Product, ProductDTO } from '@/types/product.interface'
import type { ApiResponse } from '@/types/api.interface'
```

#### Path Aliases
- `@/`: Points to `src/` directory
- `src/*`: Direct access to src files
- `components/*`: Direct access to components
- `stores/*`: Direct access to stores
- `pages/*`: Direct access to pages

### Error Handling

#### API Error Handling
```typescript
const { request } = useRequests()

async function fetchData() {
  try {
    const response = await request(apiService.getData())

    if (!response.isOk) {
      // Handle API errors
      Notify.create({
        type: 'negative',
        message: response.error || 'An error occurred'
      })
      return
    }

    // Process successful response
    processData(response.data)
  } catch (error) {
    // Handle network or unexpected errors
    console.error('Unexpected error:', error)
    Notify.create({
      type: 'negative',
      message: 'Network error. Please try again.'
    })
  }
}
```

#### Validation
```typescript
// Form validation rules
const nameRules = [
  (val: string) => val?.length > 0 || 'Name is required',
  (val: string) => val?.length <= 100 || 'Name must be less than 100 characters'
]

// Component validation
const isFormValid = computed(() => {
  return name.value.length > 0 &&
         price.value > 0 &&
         stock.value >= 0
})
```

### Internationalization (i18n)

#### Usage in Components
```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <q-input
    :label="t('products.name')"
    :rules="[(val) => val || t('validation.required')]"
  />

  <q-btn
    :label="t('common.save')"
    color="primary"
  />
</template>
```

#### Key Patterns
- Use i18n for all user-facing text
- Keys follow `namespace.key` pattern
- Use interpolation for dynamic values: `t('messages.items_found', { count: items.length })`
- Keep translation keys organized by feature

### Performance Considerations

#### Vue Optimizations
- Use `shallowRef` for large objects that don't need deep reactivity
- Memoize expensive computations with `computed`
- Use `nextTick` for DOM manipulations after updates
- Lazy load components for better initial bundle size

#### API Optimization
- Implement caching in stores where appropriate
- Use pagination for large datasets
- Debounce search inputs
- Cancel previous requests when making new ones

This document should be updated as the project evolves. Always run tests and linting before committing changes.</content>
<parameter name="filePath">AGENTS.md