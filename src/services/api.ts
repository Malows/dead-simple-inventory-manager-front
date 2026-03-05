export const HOST = process.env.HOST || ''
export const URL = `${HOST}/api`

// session
export const LOGIN = `${HOST}/oauth/token`
export const USER_URL = `${URL}/user`

// crud
export const BRANDS_URL = `${URL}/brands`
export const CATEGORIES_URL = `${URL}/categories`
export const PRODUCTS_URL = `${URL}/products`
export const SUPPLIERS_URL = `${URL}/suppliers`

// bulk operations
export const BULK_OPERATIONS_URL = `${URL}/bulk-operations`
