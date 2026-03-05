# AGENTS.md - Dead Simple Inventory Manager Frontend

This document provides coding guidelines and commands for agentic coding assistants working on this Quasar Vue.js TypeScript project.

## Build, Lint, and Test Commands

### Development Workflow
```bash
# Start development server with hot reload
pnpm dev

# Build for production
pnpm build

# Type checking
pnpm check
```

### Code Quality
```bash
# Lint all files
pnpm lint

# Auto-fix linting issues
pnpm lint:fix

# Format code (Rust-based formatter)
pnpm fmt
```

### Testing
```bash
# Run all tests once
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage report
pnpm test:coverage

# Run tests for a specific file or directory pattern
pnpm vitest run src/components/filterable
pnpm vitest run src/stores/__tests__/products.test.ts

# Run tests matching a name pattern with verbose output
pnpm vitest run --reporter=verbose "**/stores/**"
```

### Coverage Requirements
- Lines: 80%
- Functions: 80%
- Branches: 80%
- Statements: 80%

---

## Testing Infrastructure

### How Quasar is set up for tests

The project uses `@quasar/vite-plugin` inside `vitest.config.ts` so that Quasar
components (`QInput`, `QPagination`, etc.) are auto-imported and resolved during
template compilation. Without this plugin the `node` export condition of the
`quasar` package resolves to the **SSR build**, which calls
`Object.assign(ssrContext, …)` where `ssrContext` is `undefined`, throwing
`TypeError: Cannot convert undefined or null to object` on every `mount()` call.

```typescript
// vitest.config.ts
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

export default defineConfig({
  plugins: [
    vue({ template: { transformAssetUrls } }),
    quasar()   // ← required; resolves the client build and auto-imports components
  ],
  // …
})
```

`installQuasarPlugin()` is called **once** in `test/setup.ts`, which is the
global setup file. **Do not call it again inside individual test files** — doing
so causes a "Plugin has already been applied to target app" warning and can lead
to flaky behaviour.

```typescript
// test/setup.ts  (already configured — do not duplicate in test files)
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest'
installQuasarPlugin()
```

### Test file structure

```
src/
└── components/
    └── filterable/
        ├── FilterableList.vue
        └── __tests__/
            ├── FilterableList.test.ts
            ├── FilterInput.test.ts
            ├── FilterPagination.test.ts
            └── mocks.ts          ← static mock data shared across tests here
```

Keep test files in a `__tests__/` subdirectory next to the source files they
cover. Name them `<ComponentName>.test.ts`.

If a test needs static mock data, place it in a `mocks.ts` file inside the same
`__tests__/` directory and import from there. If `mocks.ts` already exists, add
to it rather than creating a separate file.

### Component test template

```typescript
import { describe, it, expect, vi } from 'vitest'
import { h } from 'vue'                // needed for scoped-slot render functions
import { mount } from '@vue/test-utils'

import MyComponent from '../MyComponent.vue'
import { mockFoo } from './mocks'

// ─── Do NOT call installQuasarPlugin() here – it runs in test/setup.ts ───

const mountComponent = (props = {}) =>
  mount(MyComponent, { props: { item: mockFoo, ...props } })

describe('MyComponent.vue', () => {
  it('renders the item name', () => {
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('Foo')
  })

  it('emits update:modelValue on interaction', async () => {
    const wrapper = mountComponent()
    const inner = wrapper.findComponent({ name: 'QInput' })
    await inner.vm.$emit('update:modelValue', 'bar')
    // Always await $nextTick after emitting on a child component
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['bar'])
  })
})
```

Key rules:
- **No `installQuasarPlugin()` in individual test files** — it lives in `test/setup.ts`.
- **Always `await wrapper.vm.$nextTick()`** after emitting events on child
  components so Vue's reactivity system flushes before asserting DOM state.
- **Scoped slots** must be a render function returning VNodes, not a template string:
  ```typescript
  slots: {
    // @ts-expect-error – generic slot inference limitation in VTU
    default: (slotProps: { item: Item }) =>
      h('div', { class: 'test-item' }, slotProps.item.name)
  }
  ```
- Use `wrapper.findComponent({ name: 'QInput' })` (by Quasar component name)
  rather than CSS selectors when targeting Quasar components.
- Use `vi.mock('…/utils/date', () => ({ toPlainString: vi.fn(…) }))` to isolate
  utility functions; declare mocks **before** the component import.

### Path aliases in tests

Inside test files use **relative imports**, not `@/` aliases:

```typescript
// ✓ correct
import MyComponent from '../MyComponent.vue'
import { mockFoo } from './mocks'
import type { Product } from '../../../../types/product.interfaces'

// ✗ avoid — @/ is not always resolved inside __tests__ dirs
import MyComponent from '@/components/MyComponent.vue'
```

The bare aliases (`src/*`, `components/*`, `stores/*`, `pages/*`, etc.) defined
in `vitest.config.ts` do work; plain relative paths are simply clearer.

---

## Code Style Guidelines

### File Organization
```
src/
├── components/     # Reusable Vue components
│   ├── filterable/ # Generic filterable list/select primitives
│   ├── forms/      # Form components
│   ├── listItems/  # List-row components (one per domain entity)
│   │   └── products/ # Sub-parts of the product list row
│   ├── dialogs/    # Modal dialog components
│   ├── pages/      # Slot-based page-frame components
│   ├── stickyButtons/ # Floating action button wrappers
│   └── operations/ # Operation-related components
├── pages/          # Route-level page components
├── layouts/        # Layout components
├── stores/         # Pinia stores
├── services/       # API and business logic services
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
├── composition/    # Vue composition functions (useXxx)
├── constants.ts    # Application constants
├── router/         # Vue router configuration
├── i18n/           # Internationalization files
└── boot/           # Quasar boot files
```

### Naming Conventions

#### Files and Directories
- PascalCase for Vue components: `ProductForm.vue`, `MainLayout.vue`
- camelCase for utility and composition files: `useRequests.ts`, `formatDate.ts`
- kebab-case for page sub-directories: `products/`, `create-page.vue`
- Store files: `products.ts` (exported as `useProductsStore`)
- Test files: `ComponentName.test.ts` placed in a `__tests__/` sibling directory
- Mock data files: `mocks.ts` inside `__tests__/`

#### Variables and Functions
- camelCase for variables, functions, and methods: `userName`, `getProducts()`
- PascalCase for types, interfaces, classes: `ProductDTO`, `UserInterface`
- SCREAMING_SNAKE_CASE for constants: `API_BASE_URL`, `DEFAULT_TIMEOUT`
- Prefix boolean variables with `is`, `has`, `can`: `isLoading`, `hasError`

### Vue Components

#### Component Structure
```vue
<script setup lang="ts">
// 1. External libraries
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

// 2. Internal modules
import { useProductsStore } from '../../stores/products'

// 3. Type imports
import type { Product } from '../../types/product.interfaces'

// Props / emits
const props = defineProps<{ productId: number }>()
const emit = defineEmits<{ update: [product: Product] }>()

// v-model support via defineModel
const searchQuery = defineModel<string>('search', { default: '' })

// Reactive state
const products = ref<Product[]>([])
const isLoading = ref(false)

// Computed
const filteredProducts = computed(() =>
  products.value.filter(p =>
    p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
)

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

onMounted(fetchProducts)
</script>

<template>
  <!-- Template content -->
</template>

<style scoped>
/* Component styles */
</style>
```

#### Component Patterns
- Use `<script setup lang="ts">` (Vue 3 composition API)
- Use `defineModel` for two-way bindings instead of manual prop + emit pairs
- Import order: external → internal → types
- Use i18n for all user-facing strings
- Handle loading and error states explicitly

### TypeScript Usage

#### Type Safety
- Strict mode is enabled in `tsconfig.json` — no implicit `any`
- Avoid `any`; use proper interfaces or `unknown`
- Use union types for constrained values: `'active' | 'inactive' | 'archived'`
- Use `Record<string, unknown>` instead of `{ [key: string]: any }`

#### Key interfaces (`src/types/`)
- `Product` / `ProductEntity` / `ProductDTO` / `RawProduct` — `product.interfaces.ts`
- `Brand` / `BrandEntity` — `brand.interfaces.ts`
- `Category` / `CategoryEntity` — `category.interfaces.ts`
- `Supplier` / `SupplierEntity` — `supplier.interfaces.ts`
- `SelectOption<T>` — `index.ts`

The `*Entity` types contain DB columns only. The hydrated types (`Product`,
`Brand`, etc.) include resolved relations and parsed `Date` fields. Use the
hydrated types in components; use `*Entity` only in lightweight mocks or store
internals.

### Pinia Stores

```typescript
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { productService } from '../services/Crud'
import { useRequests } from '../composition/useRequests'
import type { Product } from '../types/product.interfaces'

export const useProductsStore = defineStore('products', () => {
  // State
  const products = ref<Product[]>([])

  // Composition
  const { request } = useRequests()

  // Getters
  const totalValue = computed(() =>
    products.value.reduce((sum, p) => sum + (p.price ?? 0) * p.stock, 0)
  )

  // Actions
  async function getProducts() {
    const response = await request(productService.fetch())
    if (response.data) products.value = response.data
    return response
  }

  return { products, totalValue, getProducts }
})
```

Patterns:
- Composition-API style stores (`defineStore(id, () => {…})`)
- Use `useRequests()` for all API calls (handles status tracking)
- Optimistic updates where applicable
- Expose only the public surface in the `return` object

### Filterable components (`src/components/filterable/`)

| Component | Props | Description |
|---|---|---|
| `FilterableList<T>` | `items`, `filterFn?`, `itemsPerPage?` | Generic list with search + pagination. Uses a scoped slot `{ item }`. |
| `FilterableSelect<T>` | `label`, `options: SelectOption<T>[]` | `QSelect` with live client-side filtering. |
| `FilterInput` | `modelValue: string` | Debounced search input (`:debounce="300"`). |
| `FilterPagination` | `modelValue: number`, `max: number` | Page selector. |

### Testing Conventions

#### Store test template

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProductsStore } from '../products'

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
      vi.mocked(productService.fetch).mockResolvedValue({
        isOk: true,
        data: mockProducts,
        error: null,
        code: 200
      })

      await store.getProducts()

      expect(productService.fetch).toHaveBeenCalled()
      expect(store.products).toEqual(mockProducts)
    })

    it('should handle errors gracefully', async () => {
      vi.mocked(productService.fetch).mockResolvedValue({
        isOk: false,
        data: null,
        error: 'Network error',
        code: 500
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
- Mock external dependencies (services, API calls) with `vi.mock`
- Test both success and error scenarios
- Use descriptive test names and nested `describe` blocks
- Test computed properties and reactive behaviour
- Aim for ≥80% coverage across all branches

### Import/Export Patterns

```typescript
// 1. External libraries (Vue, Quasar, third-party)
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Notify } from 'quasar'

// 2. Internal modules (relative paths preferred)
import { useProductsStore } from '../../stores/products'
import { productService } from '../../services/Crud'
import ProductForm from '../ProductForm.vue'

// 3. Type imports
import type { Product, ProductDTO } from '../../types/product.interfaces'
```

### Error Handling

```typescript
const { request } = useRequests()

async function fetchData() {
  const response = await request(apiService.getData())

  if (!response.isOk) {
    Notify.create({ type: 'negative', message: response.error ?? 'An error occurred' })
    return
  }

  processData(response.data)
}
```

#### Validation
```typescript
const nameRules = [
  (val: string) => val?.length > 0 || 'Name is required',
  (val: string) => val?.length <= 100 || 'Name must be less than 100 characters'
]
```

### Internationalization (i18n)

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <q-input :label="t('products.name')" />
  <q-btn :label="t('common.save')" color="primary" />
</template>
```

- All user-facing strings must use `t('namespace.key')`
- Keys follow `namespace.key` format (e.g. `products.count`, `common.save`)
- The `products.count` key uses ICU plural rules:
  `'no products | one product | {count} products'`
  → pass count as the second argument: `t('products.count', amount)`

### Performance Considerations

- `shallowRef` for large objects that don't need deep reactivity
- `computed` to memoize expensive derivations
- `nextTick` before asserting DOM changes after reactive updates
- Lazy-load heavy components with `defineAsyncComponent`
- Debounce search inputs (FilterInput uses `:debounce="300"`)
- Cancel previous requests when issuing new ones

---

Always run `pnpm test` and `pnpm lint` before committing changes.
This document should be updated whenever patterns, tooling, or conventions change.</content>
<parameter name="filePath">AGENTS.md
