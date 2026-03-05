import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'home',
        name: 'index',
        component: () => import('pages/IndexPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '',
        redirect: '/home'
      },

      // BRANDS
      {
        path: 'brands',
        name: 'brands index',
        component: () => import('pages/brands/IndexPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'brands/create',
        name: 'brands create',
        component: () => import('pages/brands/CreatePage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'brands/:brandId',
        name: 'brands show',
        component: () => import('pages/brands/ShowPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'brands/:brandId/edit',
        name: 'brands edit',
        component: () => import('pages/brands/EditPage.vue'),
        meta: { requiresAuth: true }
      },

      // CATEGORIES
      {
        path: 'categories',
        name: 'categories index',
        component: () => import('pages/categories/IndexPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'categories/create',
        name: 'categories create',
        component: () => import('pages/categories/CreatePage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'categories/:categoryId',
        name: 'categories show',
        component: () => import('pages/categories/ShowPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'categories/:categoryId/edit',
        name: 'categories edit',
        component: () => import('pages/categories/EditPage.vue'),
        meta: { requiresAuth: true }
      },

      // PRODUCTS
      {
        path: 'products',
        name: 'products index',
        component: () => import('pages/products/IndexPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'products/create',
        name: 'products create',
        component: () => import('pages/products/CreatePage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'products/:productId',
        name: 'products show',
        component: () => import('pages/products/ShowPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'products/:productId/edit',
        name: 'products edit',
        component: () => import('pages/products/EditPage.vue'),
        meta: { requiresAuth: true }
      },

      // OPERATIONS
      {
        path: 'operations',
        name: 'operations index',
        component: () => import('pages/operations/IndexPage.vue'),
        meta: { requiresAuth: true }
      },

      // SUPPLIERS
      {
        path: 'suppliers',
        name: 'suppliers index',
        component: () => import('pages/suppliers/IndexPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'suppliers/create',
        name: 'suppliers create',
        component: () => import('pages/suppliers/CreatePage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'suppliers/:supplierId',
        name: 'suppliers show',
        component: () => import('pages/suppliers/ShowPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'suppliers/:supplierId/edit',
        name: 'suppliers edit',
        component: () => import('pages/suppliers/EditPage.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },

  {
    path: '/login',
    component: () => import('layouts/BlankLayout.vue'),
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('pages/LoginPage.vue'),
        meta: { requiresAuth: false }
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
