import { Link } from './types'

export const DRAWER_ITEMS: Link[] = [
  {
    to: '/home',
    label: 'common.Home',
    icon: 'home'
  },
  {
    to: '/products',
    label: 'products.Products',
    icon: 'bubble_chart'
  },
  {
    to: '/brands',
    label: 'brands.Brands',
    icon: 'branding_watermark'
  },
  {
    to: '/categories',
    label: 'categories.Categories',
    icon: 'local_offer'
  },
  {
    to: '/suppliers',
    label: 'suppliers.Suppliers',
    icon: 'people_alt'
  },
  {
    to: '/storage-locations',
    label: 'storage_locations.StorageLocations',
    icon: 'warehouse'
  },
  {
    to: '/operations',
    label: 'operations.Operations',
    icon: 'swap_vert'
  }
]
