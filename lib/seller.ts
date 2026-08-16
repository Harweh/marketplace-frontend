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