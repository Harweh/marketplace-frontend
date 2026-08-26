import { authedFetch } from './authedApi'
import { Product } from '@/types'

// Cart/wishlist sync with the account. Guests keep using localStorage only
// (handled by each store's own zustand persist) — these functions are only
// called once a user is actually logged in.

export interface ServerCartItem {
    product: Product
    quantity: number
    selectedSku?: string
}

export function getServerCart(): Promise<ServerCartItem[]> {
    return authedFetch<ServerCartItem[]>('/users/me/cart')
}

export function syncServerCart(
    items: { productId: string; quantity: number; selectedSku?: string }[]
): Promise<ServerCartItem[]> {
    return authedFetch<ServerCartItem[]>('/users/me/cart', {
        method: 'PUT',
        body: { items },
    })
}

export function getServerWishlist(): Promise<Product[]> {
    return authedFetch<Product[]>('/users/me/wishlist')
}

export function syncServerWishlist(productIds: string[]): Promise<Product[]> {
    return authedFetch<Product[]>('/users/me/wishlist', {
        method: 'PUT',
        body: { productIds },
    })
}