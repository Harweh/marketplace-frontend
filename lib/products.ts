import { apiFetch } from './api'
import { authedFetch } from './authedApi'
import { PaginatedProducts, Product } from '@/types'

export interface ProductQuery {
    category?: string
    minPrice?: number
    maxPrice?: number
    q?: string
    page?: number
    limit?: number
}

function buildQueryString(query: ProductQuery): string {
    const params = new URLSearchParams()
    if (query.category) params.set('category', query.category)
    if (query.minPrice !== undefined) params.set('minPrice', String(query.minPrice))
    if (query.maxPrice !== undefined) params.set('maxPrice', String(query.maxPrice))
    if (query.q) params.set('q', query.q)
    if (query.page) params.set('page', String(query.page))
    if (query.limit) params.set('limit', String(query.limit))
    const qs = params.toString()
    return qs ? `?${qs}` : ''
}

// GET /api/products — public, always sorted by newest first server-side.
export async function getProducts(query: ProductQuery = {}): Promise<PaginatedProducts> {
    return apiFetch<PaginatedProducts>(`/products${buildQueryString(query)}`)
}

// GET /api/products/:slug — public, fetch by slug (not id).
export async function getProductBySlug(slug: string): Promise<Product> {
    return apiFetch<Product>(`/products/${slug}`)
}

export interface CreateProductInput {
    title: string
    description: string
    category: string
    images: string[]
    basePrice: number
    hasVariants: boolean
    variants: {
        sku: string
        attributes: Record<string, string>
        price: number
        stock: number
    }[]
}

// POST /api/products — seller-only, requires an approved vendor profile.
// New listings always start as pending_review (admin must approve them).
export async function createProduct(input: CreateProductInput): Promise<Product> {
    return authedFetch<Product>('/products', {
        method: 'POST',
        body: input,
    })
}





