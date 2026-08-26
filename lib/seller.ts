import { authedFetch } from './authedApi'
import { Product } from '@/types'

export interface VendorProfile {
    _id: string
    storeName: string
    storeSlug: string
    description?: string
    status: 'pending' | 'approved' | 'suspended' | 'rejected'
    commissionRate: number
}

export interface SellerOrderItem {
    product: string
    sku?: string
    title: string
    price: number
    quantity: number
}

export interface SellerSubOrder {
    _id: string
    items: SellerOrderItem[]
    subtotal: number
    status: string
    trackingNumber?: string
}

export interface SellerOrder {
    _id: string
    orderNumber: string
    buyer: { name: string; email: string } | string
    shippingAddress: { line1: string; city: string; state: string; phone: string }
    createdAt: string
    subOrder: SellerSubOrder
}

// The current user's own vendor profile — 404s if they haven't applied yet.
export function getMyVendorProfile(): Promise<VendorProfile> {
    return authedFetch<VendorProfile>('/vendors/me')
}

export interface ApplyVendorInput {
    storeName: string
    description?: string
    storeAddress: string
    storeCity: string
    storeState: string
}

export function applyAsVendor(input: ApplyVendorInput): Promise<VendorProfile> {
    return authedFetch<VendorProfile>('/vendors/apply', {
        method: 'POST',
        body: input,
    })
}

// This seller's own products (all statuses, not just approved).
export function getMyProducts(): Promise<Product[]> {
    return authedFetch<Product[]>('/products/vendor/mine')
}

// This seller's own orders (only their items — other sellers' items on
// the same order are never included).
export function getMyOrders(): Promise<SellerOrder[]> {
    return authedFetch<SellerOrder[]>('/orders/seller')
}

// Sellers can only move an order forward: confirmed → packed → shipped.
// The backend enforces this even if the frontend sends something else.
export function updateSellerOrderStatus(
    orderId: string,
    subOrderId: string,
    status: string
): Promise<unknown> {
    return authedFetch(`/orders/seller/${orderId}/suborders/${subOrderId}/status`, {
        method: 'PATCH',
        body: { status },
    })
}

export interface UpdateProductInput {
    title?: string
    description?: string
    category?: string
    images?: string[]
    basePrice?: number
    variants?: { sku: string; attributes: Record<string, string>; price: number; stock: number }[]
}

// Editing price/stock is instant. Editing title/description/images/category
// sends the listing back to admin review — see the backend for why.
export function updateMyProduct(id: string, input: UpdateProductInput): Promise<Product> {
    return authedFetch<Product>(`/products/${id}`, {
        method: 'PATCH',
        body: input,
    })
}

// Soft-delete only — never removes the product, just stops it showing
// in the shop. Past orders referencing it stay intact.
export function delistMyProduct(id: string): Promise<Product> {
    return authedFetch<Product>(`/products/${id}/delist`, {
        method: 'PATCH',
    })
}