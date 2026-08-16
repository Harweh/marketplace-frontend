import { apiFetch } from './api'
import { authedFetch } from './authedApi'

export interface Review {
    _id: string
    product: string
    buyer: { _id: string; name: string } | string
    rating: number
    comment: string
    createdAt: string
}

export function getReviews(productId: string): Promise<Review[]> {
    return apiFetch<Review[]>(`/products/${productId}/reviews`)
}

export function createReview(productId: string, rating: number, comment: string): Promise<Review> {
    return authedFetch<Review>(`/products/${productId}/reviews`, {
        method: 'POST',
        body: { rating, comment },
    })
}

export function deleteReview(productId: string, reviewId: string): Promise<{ deleted: boolean }> {
    return authedFetch<{ deleted: boolean }>(`/products/${productId}/reviews/${reviewId}`, {
        method: 'DELETE',
    })
}