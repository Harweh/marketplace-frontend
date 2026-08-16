import { useAuthStore } from '@/store/auth'
import { API_BASE_URL, ApiError } from './api'
import { ApiResponse } from '@/types'

// File uploads use FormData, not JSON, so they bypass apiFetch/authedFetch
// and hit the API directly — but still need the same expired-token retry
// behavior, or a stale access token means every upload after ~1hr fails
// with "Invalid or expired token" until the user manually logs out and in.
async function doUpload(files: File[], token: string | null): Promise<string[]> {
    const formData = new FormData()
    files.forEach(file => formData.append('images', file))

    const res = await fetch(`${API_BASE_URL}/uploads/products`, {
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

export async function uploadProductImages(files: File[]): Promise<string[]> {
    const { accessToken, refreshToken, refreshAccessToken } = useAuthStore.getState()

    try {
        return await doUpload(files, accessToken)
    } catch (err) {
        if (err instanceof ApiError && err.status === 401 && refreshToken) {
            await refreshAccessToken()
            const newToken = useAuthStore.getState().accessToken
            return doUpload(files, newToken)
        }
        throw err
    }
}