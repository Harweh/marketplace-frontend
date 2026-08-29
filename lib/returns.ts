import { authedFetch } from './authedApi'
import { API_BASE_URL, ApiError } from './api'
import { useAuthStore } from '@/store/auth'
import { ApiResponse } from '@/types'

export function requestReturn(
    orderId: string,
    subOrderId: string,
    reason: string,
    photos: string[]
): Promise<unknown> {
    return authedFetch(`/returns/${orderId}/suborders/${subOrderId}/request`, {
        method: 'POST',
        body: { reason, photos },
    })
}

// File upload — same pattern as product image uploads, with retry on an
// expired token, but hits the buyer-open /returns endpoint instead.
async function doUploadReturnPhotos(files: File[], token: string | null): Promise<string[]> {
    const formData = new FormData()
    files.forEach(file => formData.append('photos', file))

    const res = await fetch(`${API_BASE_URL}/uploads/returns`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
    })

    const json = (await res.json()) as ApiResponse<{ urls: string[] }>
    if (!json.success) {
        throw new ApiError(json.error.message, res.status, json.error.details)
    }
    return json.data.urls
}

export async function uploadReturnPhotos(files: File[]): Promise<string[]> {
    const { accessToken, refreshToken, refreshAccessToken } = useAuthStore.getState()
    try {
        return await doUploadReturnPhotos(files, accessToken)
    } catch (err) {
        if (err instanceof ApiError && err.status === 401 && refreshToken) {
            await refreshAccessToken()
            const newToken = useAuthStore.getState().accessToken
            return doUploadReturnPhotos(files, newToken)
        }
        throw err
    }
}

// ─── Admin ───
export interface PendingReturnOrder {
    _id: string
    orderNumber: string
    buyer: { name: string; email: string } | string
    subOrders: {
        _id: string
        vendor: { storeName: string } | string
        items: { title: string; quantity: number; price: number }[]
        returnStatus: string
        returnReason?: string
        returnPhotos?: string[]
        returnRequestedAt?: string
    }[]
}

export function getPendingReturns(): Promise<PendingReturnOrder[]> {
    return authedFetch<PendingReturnOrder[]>('/returns/admin/pending')
}

export function resolveReturn(
    orderId: string,
    subOrderId: string,
    approve: boolean,
    adminNote?: string
): Promise<unknown> {
    return authedFetch(`/returns/${orderId}/suborders/${subOrderId}/resolve`, {
        method: 'PATCH',
        body: { approve, adminNote },
    })
}